import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Filter } from 'lucide-react';

interface PaymentItem {
  id: string;
  category: string;
  title: string;
  amount: number;
  due_date: string;
  status: string;
  is_mandatory: boolean;
  max_capacity: number;
  studentCount?: number;
  paidCount?: number;
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

export function PaymentItemsList() {
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filter, setFilter] = useState('All');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [classFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, grade, section, teachers:teacher_id(first_name, last_name)')
        .order('grade')
        .order('section');

      if (classesError) {
        console.error('Error fetching classes:', classesError);
      } else if (classesData) {
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

      const { data: paymentItems, error: fetchError } = await supabase
        .from('payment_items')
        .select('*')
        .order('due_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching payment items:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (paymentItems) {
        const itemsWithCounts = await Promise.all(
          paymentItems.map(async (item) => {
            let obligationsQuery = supabase
              .from('payment_item_students')
              .select(`
                id,
                student_id,
                payments(amount)
              `)
              .eq('payment_item_id', item.id);

            if (classFilter !== 'all') {
              const { data: studentsInClass } = await supabase
                .from('students')
                .select('id')
                .eq('class_id', classFilter);

              const studentIds = studentsInClass?.map((s) => s.id) || [];

              if (studentIds.length === 0) {
                return {
                  ...item,
                  studentCount: 0,
                  paidCount: 0,
                };
              }

              obligationsQuery = obligationsQuery.in('student_id', studentIds);
            }

            const { data: obligations } = await obligationsQuery;

            const enrolledCount = obligations?.length || 0;
            const studentCount = item.is_mandatory ? enrolledCount : item.max_capacity;

            let paidCount = 0;
            if (obligations) {
              obligations.forEach((obligation: any) => {
                const totalPaid = (obligation.payments || []).reduce(
                  (sum: number, payment: any) => sum + parseFloat(payment.amount || 0),
                  0
                );
                if (totalPaid >= item.amount) {
                  paidCount++;
                }
              });
            }

            return {
              ...item,
              studentCount,
              paidCount,
            };
          })
        );

        setItems(itemsWithCounts);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'All' || item.category === filter || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Closed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-school-red-700">Payment Items</h1>
            <p className="text-gray-600 mt-1">Manage fees, clubs, and event tickets</p>
          </div>
          <Link
            to="/admin/payment-items/new"
            className="inline-flex items-center justify-center gap-2 bg-school-red-600 hover:bg-school-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Create Payment Item</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search payment items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'Active', 'Draft', 'Closed'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === filterOption
                        ? 'bg-school-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter by Class:</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none bg-white"
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

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-12 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-school-red-600 text-white rounded-lg hover:bg-school-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No payment items found</p>
            <p className="text-sm text-gray-400 mt-2">Total items: {items.length}</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards - Hidden on md and up */}
            <div className="md:hidden space-y-4">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/admin/payment-items/${item.id}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                      {item.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.is_mandatory
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.is_mandatory ? 'Mandatory' : 'Opt-in'}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{item.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-school-red-700">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(item.due_date)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Collected vs Outstanding:</span>
                        <span className="font-bold text-green-700">
                          {item.paidCount} / {item.studentCount}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              item.studentCount ? (item.paidCount! / item.studentCount) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop/Tablet Table - Hidden on mobile */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title / Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collected / Outstanding
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => (window.location.href = `/admin/payment-items/${item.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-school-red-700">
                            {formatCurrency(item.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{formatDate(item.due_date)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.is_mandatory
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {item.is_mandatory ? 'Mandatory' : 'Opt-in'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="text-sm">
                              <span className="font-bold text-green-700">{item.paidCount}</span>
                              <span className="text-gray-500"> / </span>
                              <span className="font-medium text-gray-900">{item.studentCount}</span>
                            </div>
                            <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${
                                    item.studentCount
                                      ? (item.paidCount! / item.studentCount) * 100
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
