import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Upload, FileText, CheckCircle2, ChevronDown, ChevronRight, Search, Filter, Download } from 'lucide-react';

interface OrderItem {
  id: string;
  payment_item_id: string;
  payment_item_title: string;
  student_id: string;
  student_name: string;
  amount: number;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  created_at: string;
  verified_at?: string;
}

interface Order {
  id: string;
  reference_number: string;
  guardian_name: string;
  student_name: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  payments: Payment[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    reference_number: 'ORD-2024-001',
    guardian_name: 'John Smith',
    student_name: 'Emma Smith',
    total_amount: 1250.00,
    paid_amount: 1250.00,
    status: 'paid',
    created_at: '2024-01-15T10:30:00Z',
    items: [
      { id: 'i1', payment_item_id: 'pi1', payment_item_title: 'School Fees - Term 1', student_id: 's1', student_name: 'Emma Smith', amount: 800.00 },
      { id: 'i2', payment_item_id: 'pi2', payment_item_title: 'Art Class', student_id: 's1', student_name: 'Emma Smith', amount: 450.00 },
    ],
    payments: [
      { id: 'p1', amount: 800.00, method: 'bank_transfer', created_at: '2024-01-15T11:00:00Z', verified_at: '2024-01-15T14:00:00Z' },
      { id: 'p2', amount: 450.00, method: 'wipay', created_at: '2024-01-15T11:05:00Z', verified_at: '2024-01-15T11:06:00Z' },
    ],
  },
  {
    id: '2',
    reference_number: 'ORD-2024-002',
    guardian_name: 'Sarah Johnson',
    student_name: 'Michael Johnson',
    total_amount: 1500.00,
    paid_amount: 750.00,
    status: 'partial',
    created_at: '2024-01-16T09:15:00Z',
    items: [
      { id: 'i3', payment_item_id: 'pi1', payment_item_title: 'School Fees - Term 1', student_id: 's2', student_name: 'Michael Johnson', amount: 800.00 },
      { id: 'i4', payment_item_id: 'pi3', payment_item_title: 'Sports Program', student_id: 's2', student_name: 'Michael Johnson', amount: 700.00 },
    ],
    payments: [
      { id: 'p3', amount: 750.00, method: 'cash', created_at: '2024-01-16T10:00:00Z', verified_at: '2024-01-16T10:30:00Z' },
    ],
  },
  {
    id: '3',
    reference_number: 'ORD-2024-003',
    guardian_name: 'David Williams',
    student_name: 'Olivia Williams',
    total_amount: 950.00,
    paid_amount: 0,
    status: 'pending',
    created_at: '2024-01-17T14:20:00Z',
    items: [
      { id: 'i5', payment_item_id: 'pi1', payment_item_title: 'School Fees - Term 1', student_id: 's3', student_name: 'Olivia Williams', amount: 800.00 },
      { id: 'i6', payment_item_id: 'pi4', payment_item_title: 'Music Lessons', student_id: 's3', student_name: 'Olivia Williams', amount: 150.00 },
    ],
    payments: [],
  },
  {
    id: '4',
    reference_number: 'ORD-2024-004',
    guardian_name: 'Maria Garcia',
    student_name: 'Sophia Garcia',
    total_amount: 2100.00,
    paid_amount: 1400.00,
    status: 'partial',
    created_at: '2024-01-18T08:45:00Z',
    items: [
      { id: 'i7', payment_item_id: 'pi1', payment_item_title: 'School Fees - Term 1', student_id: 's4', student_name: 'Sophia Garcia', amount: 800.00 },
      { id: 'i8', payment_item_id: 'pi5', payment_item_title: 'Field Trip', student_id: 's4', student_name: 'Sophia Garcia', amount: 300.00 },
      { id: 'i9', payment_item_id: 'pi2', payment_item_title: 'Art Class', student_id: 's4', student_name: 'Sophia Garcia', amount: 450.00 },
      { id: 'i10', payment_item_id: 'pi6', payment_item_title: 'Textbooks', student_id: 's4', student_name: 'Sophia Garcia', amount: 550.00 },
    ],
    payments: [
      { id: 'p4', amount: 1000.00, method: 'bank_transfer', created_at: '2024-01-18T09:00:00Z', verified_at: '2024-01-18T15:00:00Z' },
      { id: 'p5', amount: 400.00, method: 'wipay', created_at: '2024-01-18T09:15:00Z', verified_at: '2024-01-18T09:16:00Z' },
    ],
  },
];

export function Payments() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/pdf')) {
      setSelectedFile(file);
      setUploadComplete(false);
      setUploadProgress(0);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          const randomCount = Math.floor(Math.random() * 50) + 20;
          setTransactionCount(randomCount);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getPaymentProgress = (paidAmount: number, totalAmount: number) => {
    return totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 100) return 'bg-yellow-200';
    return 'bg-green-200';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      wipay: 'WiPay',
      cash: 'Cash',
    };
    return methodMap[method] || method;
  };

  const filteredOrders = MOCK_ORDERS
    .filter((order) => {
      const matchesSearch =
        order.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guardian_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.student_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.total_amount - b.total_amount;
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>

        {/* Import Transactions Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Transactions from Bank
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 cursor-pointer">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {selectedFile ? (
                        <span className="font-medium text-blue-600">{selectedFile.name}</span>
                      ) : (
                        <>
                          <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">CSV or PDF files only</p>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv, text/csv, .pdf, application/pdf"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {selectedFile && !uploadComplete && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Reading transactions...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Upload completed! {transactionCount} transactions read from file, with {transactionCount - 20} reconciled to orders.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Export to Quickbooks
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by reference, guardian, or student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="status">Sort by Status</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guardian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  const progress = getPaymentProgress(order.paid_amount, order.total_amount);

                  return (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.reference_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.guardian_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.student_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Paid: {formatCurrency(order.paid_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>{progress.toFixed(0)}%</span>
                              <span>{formatCurrency(order.paid_amount)} / {formatCurrency(order.total_amount)}</span>
                            </div>
                            <div className={`w-full ${getProgressBarColor(progress)} rounded-full h-2`}>
                              <div
                                className={`${getProgressColor(progress)} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 gap-6">
                              {/* Order Items */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {item.payment_item_title}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            Student: {item.student_name}
                                          </div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {formatCurrency(item.amount)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Payments */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                  Payments Received ({order.payments.length})
                                </h4>
                                {order.payments.length > 0 ? (
                                  <div className="space-y-2">
                                    {order.payments.map((payment) => (
                                      <div
                                        key={payment.id}
                                        className="bg-white p-3 rounded-lg border border-gray-200"
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">
                                              {formatPaymentMethod(payment.method)}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                              {formatDate(payment.created_at)}
                                            </div>
                                            {payment.verified_at && (
                                              <div className="flex items-center gap-1 mt-1">
                                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                <span className="text-xs text-green-600">Verified</span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {formatCurrency(payment.amount)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-sm text-gray-500">
                                    No payments received yet
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No orders found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
