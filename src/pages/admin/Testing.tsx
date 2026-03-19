import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Trash2, Navigation  } from 'lucide-react';




interface Guardian {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
}



export function Testing() {
  const navigate = useNavigate();
  const [allGuardians, setAllGuardians] = useState<Guardian[]>([]);
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>('');
  const [deletedPaymentData, setDeletedPaymentData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: guardiansData } = await supabase
      .from('guardians')
      .select('*')
      .order('first_name', { ascending: true });

    if (guardiansData && guardiansData.length > 0) {
      setSelectedGuardianId(guardiansData[0].id);
      setAllGuardians(guardiansData);
    };
  };

  const handleSwitch = () => {
    const guardian = allGuardians.find(x => x.id === selectedGuardianId)
    if(guardian)
      navigate(`/guardian/${guardian.access_token}`);
  }

  const handleDeleteAllPayments = async () => {
    let deletedAll = false;
    const { error:deleteOrderItemsError } = await supabase
      .from('order_items')
      .delete()
      .not('id', 'is', null);

    if (deleteOrderItemsError) {
      console.error('Error deleting all order_items:', deleteOrderItemsError.message);
    } else {
      deletedAll = true;
      console.log('All order_items deleted successfully!');
    }

    
    const { error:deleteOrdersError } = await supabase
      .from('orders')
      .delete()
     .not('id', 'is', null);

    if (deleteOrdersError) {
      console.error('Error deleting all orders:', deleteOrdersError.message);
    } else {
      deletedAll &=  true;
      console.log('All orders deleted successfully!');
    }

    const { error:deletePaymentsError } = await supabase
      .from('payments')
      .delete()
      .not('id', 'is', null);

    if (deletePaymentsError) {
      console.error('Error deleting all payments:', deletePaymentsError.message);
    } else {
      deletedAll &= true;
      console.log('All payments deleted successfully!');
    }

    if(deletedAll)
      setDeletedPaymentData(true);
  }

  return (
    <AdminLayout>
      <div className="space-y-8">

  {/* Guardian Selection */}
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Guardian View
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Guardian
        </label>
        <select
          value={selectedGuardianId}
          onChange={(e) => setSelectedGuardianId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
        >
          {allGuardians.map(g => (
            <option key={g.id} value={g.id}>
              {g.first_name} {g.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSwitch}
          className="inline-flex items-center gap-2 px-4 py-2
                     bg-school-red-600 text-white rounded-lg
                     hover:bg-school-red-700 transition-colors"
        >
          <Navigation size={18} />
          Switch to Guardian View
        </button>
      </div>
    </div>
  </div>

  {/* Payments Admin Actions */}
  <div className="bg-white rounded-xl border border-red-200 shadow-sm">
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-red-700">
        Payment Administration
      </h2>

      <p className="text-sm text-gray-600">
        This action permanently deletes all payment records.
        Use with caution.
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={handleDeleteAllPayments}
          className="inline-flex items-center gap-2 px-4 py-2
                     bg-red-600 text-white rounded-lg
                     hover:bg-red-700 transition-colors"
        >
          <Trash2 size={18} />
          Delete All Payments
        </button>

        {deletedPaymentData && (
          <span className="text-sm text-green-600 font-medium">
            Payments successfully deleted
          </span>
        )}
      </div>
    </div>
  </div>

</div>

    </AdminLayout>
  );
}
