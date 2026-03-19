import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { supabase } from '../../lib/supabase';
import { Upload, CheckCircle, Clock, CreditCard, Building2, ArrowLeft } from 'lucide-react';

interface ObligationData {
  id: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
  };
  payment_item: {
    title: string;
    amount: number;
    due_date: string;
    wipay_enabled: boolean;
  };
  payments: Array<{
    amount: number;
    method: string;
    verified_at: string;
    reference_number: string;
  }>;
}

export function GuardianPayment() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [obligation, setObligation] = useState<ObligationData | null>(null);
  const [uploadStep, setUploadStep] = useState<'initial' | 'uploading' | 'submitted'>('initial');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadObligationData();
  }, [token]);

  const loadObligationData = async () => {
    const { data } = await supabase
      .from('payment_item_students')
      .select(
        `
        id,
        student:students (
          id,
          first_name,
          last_name
        ),
        payment_item:payment_items (
          title,
          amount,
          due_date,
          wipay_enabled
        ),
        payments (
          amount,
          method,
          verified_at,
          reference_number
        )
      `
      )
      .limit(1)
      .maybeSingle();

    if (data) {
      setObligation(data as any);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStep('uploading');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (obligation) {
      await supabase
        .from('payments')
        .insert({
          payment_item_student_id: obligation.id,
          amount: obligation.payment_item.amount,
          method: 'Bank Transfer',
          reference_number: referenceNumber,
          submitted_at: new Date().toISOString(),
        });

      setUploadStep('submitted');
      loadObligationData();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TT', {
      style: 'currency',
      currency: 'TTD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TT', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!obligation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
      </div>
    );
  }

  const totalPaid = (obligation.payments || []).reduce(
    (sum, payment) => sum + parseFloat(payment.amount.toString()),
    0
  );
  const amountDue = obligation.payment_item.amount;
  const isPaid = totalPaid >= amountDue;
  const hasSubmittedReceipt = obligation.payments && obligation.payments.length > 0;
  const hasVerifiedPayment = obligation.payments?.some(p => p.verified_at);

  const uniqueReference = `MRGS-${obligation.student.first_name.substring(0, 2).toUpperCase()}${obligation.student.last_name.substring(0, 2).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <button
          onClick={() => navigate(`/guardian/payment-items?token=${token}`)}
          className="flex items-center gap-2 text-school-red-600 hover:text-school-red-700 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Payment Items</span>
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-school-red-600 text-white p-6">
            <h1 className="text-2xl font-serif font-bold mb-2">Payment Details</h1>
            <p className="text-school-red-100">
              For {obligation.student.first_name} {obligation.student.last_name}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-school-red-700 mb-4">
                {obligation.payment_item.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Amount Due</div>
                  <div className="text-2xl font-bold text-school-red-700">
                    {formatCurrency(amountDue)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Due Date</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatDate(obligation.payment_item.due_date)}
                  </div>
                </div>
              </div>
              {totalPaid > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-700">
                    Paid: {formatCurrency(totalPaid)} of {formatCurrency(amountDue)}
                  </div>
                  {totalPaid < amountDue && (
                    <div className="text-sm text-blue-600 font-medium mt-1">
                      Remaining: {formatCurrency(amountDue - totalPaid)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isPaid && hasVerifiedPayment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <div className="font-semibold text-green-900">Payment Verified</div>
                    <div className="text-sm text-green-700 mt-1">
                      This payment was verified on {formatDate(obligation.payments.find(p => p.verified_at)?.verified_at || '')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasSubmittedReceipt && !hasVerifiedPayment && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="text-orange-600 flex-shrink-0" size={24} />
                  <div>
                    <div className="font-semibold text-orange-900">Under Review</div>
                    <div className="text-sm text-orange-700 mt-1">
                      Your receipt has been submitted and is being verified by our admin staff.
                      You'll be notified once it's confirmed.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isPaid && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-school-red-600" />
                    Bank Transfer Instructions
                  </h3>
                  <div className="bg-school-cream rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-xs text-gray-600">Bank Name</div>
                      <div className="font-medium">First Citizens Bank</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Account Name</div>
                      <div className="font-medium">Maria Regina Grade School</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Account Number</div>
                      <div className="font-medium">123456789</div>
                    </div>
                    <div className="border-t border-school-gold-400 pt-3">
                      <div className="text-xs text-gray-600">Reference Number (Required)</div>
                      <div className="font-bold text-school-red-700 text-lg">{uniqueReference}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Please include this reference in your transfer
                      </div>
                    </div>
                  </div>
                </div>

                {obligation.payment_item.wipay_enabled && (
                  <div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                      <CreditCard size={20} />
                      Pay by Card (WiPay)
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Available for some guardians
                    </p>
                  </div>
                )}

                {uploadStep === 'initial' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Upload size={20} className="text-school-red-600" />
                      Upload Payment Receipt
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Receipt Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reference Number
                        </label>
                        <input
                          type="text"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder={uniqueReference}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-school-red-600 hover:bg-school-red-700 text-white py-3 rounded-lg transition-colors font-medium"
                      >
                        Submit Receipt
                      </button>
                    </form>
                  </div>
                )}

                {uploadStep === 'uploading' && (
                  <div className="text-center py-8">
                    <div className="inline-block w-12 h-12 border-4 border-school-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="mt-4 text-gray-600">Submitting receipt...</div>
                  </div>
                )}

                {uploadStep === 'submitted' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                      <div>
                        <div className="font-semibold text-green-900">Receipt Submitted</div>
                        <div className="text-sm text-green-700 mt-1">
                          Thank you! Your receipt has been submitted for verification. You'll
                          receive a notification once it's confirmed.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 mt-8">
          Concept Preview - School Payment Portal
        </footer>
      </div>
    </div>
  );
}
