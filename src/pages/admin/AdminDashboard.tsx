import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { DollarSign, AlertCircle, CheckCircle, FileText, Plus, Bell } from 'lucide-react';

interface ActivityLog {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    collectedThisTerm: 0,
    overdueCount: 0,
    activeItems: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: paymentItems } = await supabase
      .from('payment_items')
      .select('*')
      .eq('status', 'Active');

    const { data: activityLogs } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    let totalOutstanding = 0;
    let collectedThisTerm = 0;
    let overdueCount = 0;

    if (paymentItems) {
      for (const item of paymentItems) {
        const { data: obligations } = await supabase
          .from('payment_item_students')
          .select(`
            id,
            payments(amount)
          `)
          .eq('payment_item_id', item.id);

        if (item.is_mandatory) {
          obligations?.forEach((obligation: any) => {
            const itemAmount = parseFloat(item.amount || 0);
            const paidAmount = (obligation.payments || []).reduce(
              (sum: number, payment: any) => sum + parseFloat(payment.amount || 0),
              0
            );

            collectedThisTerm += paidAmount;

            const outstanding = itemAmount - paidAmount;
            if (outstanding > 0) {
              totalOutstanding += outstanding;
              overdueCount++;
            }
          });
        } else {
          // Opt-in items: count collected payments but don't add to outstanding
          obligations?.forEach((obligation: any) => {
            const paidAmount = (obligation.payments || []).reduce(
              (sum: number, payment: any) => sum + parseFloat(payment.amount || 0),
              0
            );
            collectedThisTerm += paidAmount;
          });
        }
      }

      setStats({
        totalOutstanding,
        collectedThisTerm,
        overdueCount,
        activeItems: paymentItems?.length || 0,
      });
    }

    if (activityLogs) {
      setActivities(activityLogs);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-school-red-700">Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of payment activities</p>
          </div>
          <div className="flex flex-wrap gap-3">
           
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Total Outstanding</span>
              <div className="w-10 h-10 bg-school-red-50 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-school-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-school-red-700">
              {formatCurrency(stats.totalOutstanding)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Collected This Term</span>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(stats.collectedThisTerm)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Unpaid Obligations</span>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-700">{stats.overdueCount}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm font-medium">Active Payment Items</span>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{stats.activeItems}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-serif font-bold text-school-red-700">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No recent activity</div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-school-gold-400 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
