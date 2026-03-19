import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Download, AlertTriangle, Link as LinkIcon, Filter } from 'lucide-react';

interface BankTransaction {
  id: string;
  transaction_date: string;
  reference: string;
  amount: number;
  description: string;
  matched_payment_id: string | null;
}

interface UnmatchedPayment {
  id: string;
  student_id: string;
  student_name: string;
  payment_item: string;
  amount: number;
  reference_number: string;
}

interface Class {
  id: string;
  grade: string;
  section: string;
  teacher: {
    first_name: string;
    last_name: string;
  };
}

export function Reconciliation() {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [unmatchedPayments, setUnmatchedPayments] = useState<UnmatchedPayment[]>([]);
  const [allPayments, setAllPayments] = useState<UnmatchedPayment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classFilter, setClassFilter] = useState<string>('all');

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    loadReconciliationData();
  }, [classFilter]);

  const loadClasses = async () => {
    const { data: classesData } = await supabase
      .from('classes')
      .select('id, grade, section, teachers:teacher_id(first_name, last_name)')
      .order('grade')
      .order('section');

    if (classesData) {
      const formattedClasses = classesData.map((cls: any) => ({
        id: cls.id,
        grade: cls.grade,
        section: cls.section,
        teacher: {
          first_name: cls.teachers?.first_name || '',
          last_name: cls.teachers?.last_name || '',
        },
      }));
      setClasses(formattedClasses);
    }
  };

  const loadReconciliationData = async () => {
    const { data: bankData } = await supabase
      .from('bank_transactions')
      .select('*')
      .order('transaction_date', { ascending: false });

    if (bankData) {
      setTransactions(bankData);
    }

    const { data: paymentsData } = await supabase
      .from('payments')
      .select(
        `
        id,
        amount,
        reference_number,
        verified_at,
        payment_item_student:payment_item_students (
          student:students (
            id,
            first_name,
            last_name,
            class_id
          ),
          payment_item:payment_items (
            title
          )
        )
      `
      )
      .is('verified_at', null);

    if (paymentsData) {
      const formatted = paymentsData
        .filter((p: any) => p.payment_item_student)
        .map((p: any) => ({
          id: p.id,
          student_id: p.payment_item_student.student.id,
          student_name: `${p.payment_item_student.student.first_name} ${p.payment_item_student.student.last_name}`,
          payment_item: p.payment_item_student.payment_item.title,
          amount: parseFloat(p.amount),
          reference_number: p.reference_number || 'N/A',
          class_id: p.payment_item_student.student.class_id,
        }));

      setAllPayments(formatted);

      if (classFilter === 'all') {
        setUnmatchedPayments(formatted);
      } else {
        const filtered = formatted.filter((p: any) => p.class_id === classFilter);
        setUnmatchedPayments(filtered);
      }
    }
  };

  const handleMatch = async (transactionId: string, paymentId: string) => {
    await supabase
      .from('bank_transactions')
      .update({ matched_payment_id: paymentId })
      .eq('id', transactionId);

    await supabase
      .from('payments')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', paymentId);

    loadReconciliationData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TT', {
      style: 'currency',
      currency: 'TTD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TT', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const exportToCSV = () => {
    const csv = [
      ['Date', 'Reference', 'Student', 'Payment Item', 'Amount', 'Method', 'Status'],
      ...transactions.map((t) => [
        t.transaction_date,
        t.reference,
        '',
        '',
        t.amount,
        'Bank Transfer',
        t.matched_payment_id ? 'Matched' : 'Unmatched',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reconciliation-export.csv';
    a.click();
  };

  const unmatchedTransactions = transactions.filter((t) => !t.matched_payment_id);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-school-red-700">Reconciliation</h1>
            <p className="text-gray-600 mt-1">Match bank transactions with payments</p>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-school-red-600 hover:bg-school-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Download size={20} />
            <span>Export to CSV</span>
          </button>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-orange-800">
            <strong>Important:</strong> Always verify receipts carefully. Be alert for fake or
            altered receipts. When in doubt, contact the guardian directly.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-serif font-bold text-school-red-700">
                Bank Transactions
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Unmatched: {unmatchedTransactions.length}
              </p>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {unmatchedTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  All transactions matched
                </div>
              ) : (
                unmatchedTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Ref: {transaction.reference}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.transaction_date)}
                        </div>
                        {transaction.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {transaction.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Unmatched</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-lg font-serif font-bold text-school-red-700">
                    Pending Payments
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Awaiting verification: {unmatchedPayments.length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none bg-white text-sm"
                  >
                    <option value="all">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.grade} {cls.section} - {cls.teacher.first_name} {cls.teacher.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {unmatchedPayments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No pending payments</div>
              ) : (
                unmatchedPayments.map((payment) => (
                  <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{payment.student_name}</div>
                      <div className="text-sm text-gray-600 mt-1">{payment.payment_item}</div>
                      <div className="text-sm text-gray-900 font-medium mt-1">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ref: {payment.reference_number}
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            const matchingTransaction = unmatchedTransactions.find(
                              (t) => Math.abs(t.amount - payment.amount) < 0.01
                            );
                            if (matchingTransaction) {
                              handleMatch(matchingTransaction.id, payment.id);
                            }
                          }}
                          className="flex items-center gap-2 text-school-red-600 hover:text-school-red-700 text-sm font-medium"
                        >
                          <LinkIcon size={16} />
                          Auto-Match by Amount
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-serif font-bold text-school-red-700 mb-3">
            Export Preview (QuickBooks-friendly)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Reference</th>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Payment Item</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-left">Method</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-2">{formatDate(transaction.transaction_date)}</td>
                    <td className="px-4 py-2">{transaction.reference}</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(transaction.amount)}</td>
                    <td className="px-4 py-2">Bank Transfer</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          transaction.matched_payment_id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {transaction.matched_payment_id ? 'Matched' : 'Unmatched'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
