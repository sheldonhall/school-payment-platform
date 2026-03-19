import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Pencil, Trash2, Plus, X, Search, Users } from 'lucide-react';

interface Class {
  id: string;
  grade: string;
  section: string;
  teacher_id: string | null;
  teacher?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  student_count?: number;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    grade: '',
    section: '',
    teacher_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: classesData } = await supabase
      .from('classes')
      .select('*, teacher:teachers(first_name, last_name, email)')
      .order('grade', { ascending: true })
      .order('section', { ascending: true });

    const { data: teachersData } = await supabase
      .from('teachers')
      .select('*')
      .order('last_name', { ascending: true });

    if (classesData) {
      const classesWithCounts = await Promise.all(
        classesData.map(async (cls) => {
          const { count } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', cls.id);

          return { ...cls, student_count: count || 0 };
        })
      );
      setClasses(classesWithCounts);
    }

    if (teachersData) setTeachers(teachersData);
  };

  const openDialog = (cls?: Class) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        grade: cls.grade,
        section: cls.section,
        teacher_id: cls.teacher_id || '',
      });
    } else {
      setEditingClass(null);
      setFormData({
        grade: '',
        section: '',
        teacher_id: '',
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClass(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      teacher_id: formData.teacher_id || null,
    };

    try {
      if (editingClass) {
        const { error } = await supabase
          .from('classes')
          .update(payload)
          .eq('id', editingClass.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('classes').insert(payload);

        if (error) throw error;
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class. Please try again.');
    }
  };

  const handleDelete = async (cls: Class) => {
    if (!confirm(`Are you sure you want to delete ${cls.grade} - ${cls.section}? Students in this class will be unassigned.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', cls.id);

      if (error) throw error;

      loadData();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class. Please try again.');
    }
  };

  const filteredClasses = classes.filter((cls) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const className = `${cls.grade} ${cls.section}`.toLowerCase();
    const teacherName = cls.teacher
      ? `${cls.teacher.first_name} ${cls.teacher.last_name}`.toLowerCase()
      : '';
    return className.includes(searchLower) || teacherName.includes(searchLower);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600 mt-1">Manage classes and teacher assignments</p>
          </div>
          <button
            onClick={() => openDialog()}
            className="flex items-center gap-2 px-4 py-2 bg-school-red-600 text-white rounded-lg hover:bg-school-red-700 transition-colors"
          >
            <Plus size={20} />
            Add Class
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by class or teacher name..."
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
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cls.grade} - {cls.section}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cls.teacher ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cls.teacher.first_name} {cls.teacher.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cls.teacher.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No teacher assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} className="text-gray-400" />
                        {cls.student_count} {cls.student_count === 1 ? 'student' : 'students'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDialog(cls)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit class"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete class"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredClasses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'No classes found matching your search.' : 'No classes yet. Add your first class to get started.'}
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
                {editingClass ? 'Edit Class' : 'Add Class'}
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
                  Grade
                </label>
                <input
                  type="text"
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                  placeholder="e.g., Standard 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                  placeholder="e.g., A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                >
                  <option value="">No teacher assigned</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name} ({teacher.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a teacher to assign to this class
                </p>
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
                  {editingClass ? 'Save Changes' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
