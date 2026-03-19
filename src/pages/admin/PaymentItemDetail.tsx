import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, CheckCircle, Clock, XCircle, Users, Send, Filter, Search, Trash2, Edit, FileImage, ChevronDown, Circle, MapPin, Calendar } from 'lucide-react';

interface StudentObligation {
  id: string;
  obligationId: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    class: {
      grade: string;
      section: string;
      teacher: {
        first_name: string;
        last_name: string;
      };
    };
  };
  guardians: Array<{
    first_name: string;
    last_name: string;
    phone: string;
    whatsapp: string;
  }>;
  totalPaid: number;
  lastPaymentMethod: string | null;
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

export function PaymentItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentItem, setPaymentItem] = useState<any>(null);
  const [obligations, setObligations] = useState<StudentObligation[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classFilter, setClassFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedObligation, setSelectedObligation] = useState<StudentObligation | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, classFilter]);

  const loadData = async () => {
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

    const { data: item } = await supabase
      .from('payment_items')
      .select('*')
      .eq('id', id)
      .single();

    if (item) {
      setPaymentItem(item);
    }

    let obligationsQuery = supabase
      .from('payment_item_students')
      .select(`
        id,
        student:students (
          id,
          first_name,
          last_name,
          class_id,
          class:classes (
            grade,
            section,
            teacher:teachers (
              first_name,
              last_name
            )
          )
        ),
        payments (
          amount,
          method
        )
      `)
      .eq('payment_item_id', id);

    if (classFilter !== 'all') {
      const { data: studentsInClass } = await supabase
        .from('students')
        .select('id')
        .eq('class_id', classFilter);

      const studentIdsInClass = studentsInClass?.map((s) => s.id) || [];

      if (studentIdsInClass.length > 0) {
        obligationsQuery = obligationsQuery.in('student_id', studentIdsInClass);
      } else {
        setObligations([]);
        return;
      }
    }

    const { data: obligationsData } = await obligationsQuery;

    if (obligationsData) {
      const obligationsWithGuardians = await Promise.all(
        obligationsData.map(async (obligation: any) => {
          const { data: guardianLinks } = await supabase
            .from('student_guardians')
            .select(`
              guardian:guardians (
                first_name,
                last_name,
                phone,
                whatsapp
              )
            `)
            .eq('student_id', obligation.student.id);

          const totalPaid = (obligation.payments || []).reduce(
            (sum: number, payment: any) => sum + parseFloat(payment.amount || 0),
            0
          );

          const lastPayment = obligation.payments && obligation.payments.length > 0
            ? obligation.payments[obligation.payments.length - 1]
            : null;

          return {
            id: obligation.student.id,
            obligationId: obligation.id,
            student: {
              ...obligation.student,
              class: {
                grade: obligation.student.class?.grade || '',
                section: obligation.student.class?.section || '',
                teacher: {
                  first_name: obligation.student.class?.teacher?.first_name || '',
                  last_name: obligation.student.class?.teacher?.last_name || '',
                },
              },
            },
            guardians: guardianLinks?.map((g: any) => g.guardian) || [],
            totalPaid,
            lastPaymentMethod: lastPayment?.method || null,
          };
        })
      );

      setObligations(obligationsWithGuardians);
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

  const maskPhone = (phone: string) => {
    if (!phone) return 'N/A';
    return `${phone.slice(0, 4)}...${phone.slice(-2)}`;
  };

  const calculateStatus = (totalPaid: number, itemAmount: number): string => {
    if (totalPaid >= itemAmount) {
      return 'Paid';
    } else if (totalPaid > 0) {
      return 'Partially Paid';
    }
    return 'Unpaid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Partially Paid':
        return <Clock className="text-blue-600" size={20} />;
      default:
        return <Circle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${paymentItem.title}"? This will also delete all associated payments and cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const { error: itemError } = await supabase
        .from('payment_items')
        .delete()
        .eq('id', id);

      if (itemError) throw itemError;

      navigate('/admin/payment-items');
    } catch (error) {
      console.error('Error deleting payment item:', error);
      alert('Failed to delete payment item. Please try again.');
    }
  };

  const openMarkPaidDialog = (obligation: StudentObligation) => {
    setSelectedObligation(obligation);
    const remainingAmount = paymentItem.amount - obligation.totalPaid;
    setPaymentAmount(remainingAmount.toString());
    setPaymentMethod('');
  };

  const closeMarkPaidDialog = () => {
    setSelectedObligation(null);
    setPaymentAmount('');
    setPaymentMethod('');
  };

  const handleMarkPaid = async () => {
    if (!selectedObligation || !paymentMethod || !paymentAmount) {
      alert('Please select a payment method and enter an amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Get guardian_id for this student
      const { data: guardianLink, error: guardianError } = await supabase
        .from('student_guardians')
        .select('guardian_id')
        .eq('student_id', selectedObligation.student.id)
        .limit(1)
        .maybeSingle();

      if (guardianError) throw guardianError;
      if (!guardianLink) {
        alert('No guardian found for this student');
        return;
      }

      // Check if an order already exists for this payment_item_student
      const { data: existingOrderItem, error: orderItemCheckError } = await supabase
        .from('order_items')
        .select('order_id, orders!inner(id)')
        .eq('payment_item_id', paymentItem.id)
        .eq('student_id', selectedObligation.student.id)
        .limit(1)
        .maybeSingle();

      if (orderItemCheckError) throw orderItemCheckError;

      let orderId: string;

      if (existingOrderItem) {
        // Use existing order
        orderId = existingOrderItem.order_id;
      } else {
        // Create new order and order_item
        const referenceNumber = `TT${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            guardian_id: guardianLink.guardian_id,
            reference_number: referenceNumber,
            total_amount: paymentItem.amount,
            payment_method: paymentMethod.toLowerCase().replace(' ', '_'),
            status: 'verified',
          })
          .select()
          .single();

        if (orderError) throw orderError;
        orderId = newOrder.id;

        // Create order_item
        const { error: orderItemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderId,
            payment_item_id: paymentItem.id,
            student_id: selectedObligation.student.id,
            amount: paymentItem.amount,
          });

        if (orderItemError) throw orderItemError;
      }

      // Create payment with order_id
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          payment_item_student_id: selectedObligation.obligationId,
          amount: amount,
          method: paymentMethod,
          verified_at: new Date().toISOString(),
        });

      if (paymentError) throw paymentError;

      closeMarkPaidDialog();
      loadData();
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment. Please try again.');
    }
  };

  if (!paymentItem) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  const sortedObligations = obligations.sort((a, b) => {
    const nameA = `${a.student.first_name} ${a.student.last_name}`.toLowerCase();
    const nameB = `${b.student.first_name} ${b.student.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const filteredObligations = sortedObligations.filter((obligation) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${obligation.student.first_name} ${obligation.student.last_name}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  const itemAmount = paymentItem.amount;
  const paidCount = filteredObligations.filter((o) => calculateStatus(o.totalPaid, itemAmount) === 'Paid').length;
  const partiallyPaidCount = filteredObligations.filter((o) => calculateStatus(o.totalPaid, itemAmount) === 'Partially Paid').length;

  const actualUnpaidCount = filteredObligations.filter((o) => calculateStatus(o.totalPaid, itemAmount) === 'Unpaid').length;
  const unpaidCount = paymentItem.is_mandatory
    ? actualUnpaidCount
    : Math.max(0, paymentItem.max_capacity - paidCount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/payment-items')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-school-red-700">
                {paymentItem.title}
              </h1>
              <p className="text-gray-600 mt-1">{paymentItem.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/payment-items/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-school-red-600 hover:bg-school-red-700 text-white rounded-lg transition-colors"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Amount</div>
            <div className="text-2xl font-bold text-school-red-700">
              {formatCurrency(paymentItem.amount)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Due Date</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatDate(paymentItem.due_date)}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Type</div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                paymentItem.is_mandatory
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {paymentItem.is_mandatory ? 'Mandatory' : 'Opt-in'}
            </span>
            {!paymentItem.is_mandatory && (
              <div className="text-xs text-gray-500 mt-1">Max: {paymentItem.max_capacity}</div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className="text-2xl font-bold text-gray-900">{paymentItem.status}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-school-red-600" />
                Location
              </div>
              <div className="text-gray-900">{paymentItem.location || 'At school'}</div>
            </div>

            {paymentItem.schedule && paymentItem.schedule.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-school-red-600" />
                  Schedule
                </div>
                <div className="space-y-2">
                  {paymentItem.schedule.map((entry: any, index: number) => (
                    <div key={index} className="text-sm text-gray-900">
                      <span className="font-medium">{entry.day}</span>: {entry.startTime} - {entry.endTime}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {paymentItem.file_url && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileImage size={18} />
              Attachment
            </div>
            <button
              onClick={() => window.open(paymentItem.file_url, '_blank')}
              className="relative group"
            >
              <img
                src={paymentItem.file_url}
                alt="Payment item attachment"
                className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-school-red-500 transition-colors"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                  Click to view full size
                </span>
              </div>
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <div className="text-2xl font-bold text-green-700">{paidCount}</div>
                <div className="text-sm text-green-600">Paid</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={24} />
              <div>
                <div className="text-2xl font-bold text-blue-700">{partiallyPaidCount}</div>
                <div className="text-sm text-blue-600">Partial</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" size={24} />
              <div>
                <div className="text-2xl font-bold text-red-700">{unpaidCount}</div>
                <div className="text-sm text-red-600">Unpaid</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-school-red-600" />
                <h2 className="text-xl font-serif font-bold text-school-red-700">
                  Student Roster
                </h2>
              </div>
              <button className="flex items-center justify-center gap-2 bg-school-red-600 hover:bg-school-red-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                <Send size={18} />
                <span>Send Reminder</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search students by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none bg-white text-sm"
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

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm text-school-red-600 hover:text-school-red-700 transition-colors"
            >
              <Filter size={16} />
              <span>Advanced Filters</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {showAdvancedFilters && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-school-red-500 outline-none bg-white">
                      <option value="all">All Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partially Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-school-red-500 outline-none bg-white">
                      <option value="all">All Methods</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="wipay">WiPay</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Guardian Contact
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-school-red-500 outline-none bg-white">
                      <option value="all">All</option>
                      <option value="with">Has Contact Info</option>
                      <option value="without">Missing Contact Info</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-school-red-600 hover:bg-school-red-700 text-white text-sm rounded-lg transition-colors">
                    Apply Filters
                  </button>
                  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors">
                    Clear All
                  </button>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Note: Advanced filters are coming soon and not yet functional
                </p>
              </div>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {filteredObligations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No students found matching your search' : 'No students in this roster'}
              </div>
            ) : (
              filteredObligations.map((obligation) => {
                const actualStatus = calculateStatus(obligation.totalPaid, itemAmount);
                return (
                <div key={obligation.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(actualStatus)}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {obligation.student.first_name} {obligation.student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {obligation.student.class.grade} {obligation.student.class.section} - {obligation.student.class.teacher.first_name} {obligation.student.class.teacher.last_name}
                          </div>
                        </div>
                      </div>
                      <div className="ml-8 text-sm text-gray-600 space-y-1">
                        <div className="flex gap-4">
                          <div>
                            <span className="font-medium">Paid:</span> {formatCurrency(obligation.totalPaid)} of {formatCurrency(itemAmount)}
                          </div>
                          {obligation.lastPaymentMethod && (
                            <div>
                              <span className="font-medium">Last Method:</span> {obligation.lastPaymentMethod}
                            </div>
                          )}
                        </div>
                        <div className="font-medium">
                          Guardians ({obligation.guardians.length})
                        </div>
                        {obligation.guardians.map((guardian, idx) => (
                          <div key={idx} className="text-xs">
                            {guardian.first_name} {guardian.last_name} - WhatsApp:{' '}
                            {maskPhone(guardian.whatsapp)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          actualStatus
                        )}`}
                      >
                        {actualStatus}
                      </span>
                      {(actualStatus === 'Unpaid' || actualStatus === 'Partially Paid') && (
                        <button
                          onClick={() => openMarkPaidDialog(obligation)}
                          className="text-school-red-600 hover:text-school-red-700 px-3 py-1 text-sm border border-school-red-600 rounded-lg hover:bg-school-red-50 transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {selectedObligation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-serif font-bold text-school-red-700 mb-4">
              Record Payment
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Student</div>
                <div className="font-semibold">
                  {selectedObligation.student.first_name} {selectedObligation.student.last_name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Payment Status</div>
                <div>
                  Already Paid: {formatCurrency(selectedObligation.totalPaid)} of {formatCurrency(itemAmount)}
                </div>
                <div className="text-sm text-gray-600">
                  Remaining: {formatCurrency(itemAmount - selectedObligation.totalPaid)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-600">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select method...</option>
                  {paymentItem.bank_transfer_enabled && (
                    <option value="Bank Transfer">Bank Transfer</option>
                  )}
                  {paymentItem.wipay_enabled && (
                    <option value="WiPay">WiPay</option>
                  )}
                  {paymentItem.cash_enabled && (
                    <option value="Cash">Cash</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (TTD) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeMarkPaidDialog}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkPaid}
                  className="flex-1 px-4 py-2 bg-school-red-600 hover:bg-school-red-700 text-white rounded-lg transition-colors"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
