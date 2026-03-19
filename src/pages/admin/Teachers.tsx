import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Pencil, Trash2, Plus, X, Search, Mail, Phone } from 'lucide-react';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    const { data } = await supabase
      .from('teachers')
      .select('*')
      .order('last_name', { ascending: true });

    if (data) setTeachers(data);
  };

  const openDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        phone: teacher.phone || '',
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      phone: formData.phone || null,
    };

    try {
      if (editingTeacher) {
        const { error } = await supabase
          .from('teachers')
          .update(payload)
          .eq('id', editingTeacher.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('teachers').insert(payload);

        if (error) throw error;
      }

      closeDialog();
      loadTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher. Please try again.');
    }
  };

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${teacher.first_name} ${teacher.last_name}? Classes assigned to this teacher will be unassigned.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacher.id);

      if (error) throw error;

      loadTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Failed to delete teacher. Please try again.');
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    const email = teacher.email.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600 mt-1">Manage teacher records and contact information</p>
          </div>
          <button
            onClick={() => openDialog()}
            className="flex items-center gap-2 px-4 py-2 bg-school-red-600 text-white rounded-lg hover:bg-school-red-700 transition-colors"
          >
            <Plus size={20} />
            Add Teacher
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {teacher.first_name} {teacher.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        {teacher.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teacher.phone ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} className="text-gray-400" />
                          {teacher.phone}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No phone</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDialog(teacher)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit teacher"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete teacher"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTeachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'No teachers found matching your search.' : 'No teachers yet. Add your first teacher to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
              </h2>
              <button
                onClick={closeDialog}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                  placeholder="868-555-0100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-school-red-600 text-white rounded-lg hover:bg-school-red-700 transition-colors"
                >
                  {editingTeacher ? 'Save Changes' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
