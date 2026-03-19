import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Pencil, Trash2, Plus, X, Search, UserPlus, Star } from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  student_id: string;
  class_id: string | null;
  class?: {
    grade: string;
    section: string;
  };
}

interface Class {
  id: string;
  grade: string;
  section: string;
  teacher?: {
    first_name: string;
    last_name: string;
  };
}

interface Guardian {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
}

interface StudentGuardian {
  id?: string;
  guardian_id: string;
  guardian?: Guardian;
  relationship: string;
  is_primary: boolean;
}

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [allGuardians, setAllGuardians] = useState<Guardian[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    student_id: '',
    class_id: '',
  });
  const [studentGuardians, setStudentGuardians] = useState<StudentGuardian[]>([]);
  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [showGuardianSearch, setShowGuardianSearch] = useState(false);
  const [showNewGuardianForm, setShowNewGuardianForm] = useState(false);
  const [newGuardianData, setNewGuardianData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    whatsapp: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: studentsData } = await supabase
      .from('students')
      .select('*, class:classes(grade, section)')
      .order('last_name', { ascending: true });

    const { data: classesData } = await supabase
      .from('classes')
      .select('*, teacher:teachers(first_name, last_name)')
      .order('grade', { ascending: true });

    const { data: guardiansData } = await supabase
      .from('guardians')
      .select('*')
      .order('last_name', { ascending: true });

    if (studentsData) setStudents(studentsData);
    if (classesData) setClasses(classesData);
    if (guardiansData) setAllGuardians(guardiansData);
  };

  const openDialog = async (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        first_name: student.first_name,
        last_name: student.last_name,
        date_of_birth: student.date_of_birth,
        student_id: student.student_id,
        class_id: student.class_id || '',
      });

      const { data: guardianData } = await supabase
        .from('student_guardians')
        .select('*, guardian:guardians(*)')
        .eq('student_id', student.id);

      if (guardianData) {
        setStudentGuardians(
          guardianData.map((sg: any) => ({
            id: sg.id,
            guardian_id: sg.guardian_id,
            guardian: sg.guardian,
            relationship: sg.relationship,
            is_primary: sg.is_primary,
          }))
        );
      }
    } else {
      setEditingStudent(null);
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        student_id: '',
        class_id: '',
      });
      setStudentGuardians([]);
    }
    setIsDialogOpen(true);
    setShowGuardianSearch(false);
    setShowNewGuardianForm(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingStudent(null);
    setStudentGuardians([]);
    setGuardianSearchTerm('');
    setShowGuardianSearch(false);
    setShowNewGuardianForm(false);
    setNewGuardianData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      whatsapp: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      class_id: formData.class_id || null,
    };

    try {
      let studentId: string;

      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(payload)
          .eq('id', editingStudent.id);

        if (error) throw error;
        studentId = editingStudent.id;

        const { data: existingGuardians } = await supabase
          .from('student_guardians')
          .select('id, guardian_id')
          .eq('student_id', studentId);

        const existingGuardianIds = existingGuardians?.map((g) => g.guardian_id) || [];
        const currentGuardianIds = studentGuardians.map((g) => g.guardian_id);

        const toDelete = existingGuardians?.filter(
          (eg) => !currentGuardianIds.includes(eg.guardian_id)
        );

        if (toDelete && toDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('student_guardians')
            .delete()
            .in(
              'id',
              toDelete.map((g) => g.id)
            );

          if (deleteError) throw deleteError;
        }

        for (const sg of studentGuardians) {
          if (existingGuardianIds.includes(sg.guardian_id)) {
            const existing = existingGuardians?.find((eg) => eg.guardian_id === sg.guardian_id);
            if (existing) {
              const { error: updateError } = await supabase
                .from('student_guardians')
                .update({
                  relationship: sg.relationship,
                  is_primary: sg.is_primary,
                })
                .eq('id', existing.id);

              if (updateError) throw updateError;
            }
          } else {
            const { error: insertError } = await supabase
              .from('student_guardians')
              .insert({
                student_id: studentId,
                guardian_id: sg.guardian_id,
                relationship: sg.relationship,
                is_primary: sg.is_primary,
              });

            if (insertError) throw insertError;
          }
        }
      } else {
        const { data: newStudent, error } = await supabase
          .from('students')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        studentId = newStudent.id;

        if (studentGuardians.length > 0) {
          const guardianInserts = studentGuardians.map((sg) => ({
            student_id: studentId,
            guardian_id: sg.guardian_id,
            relationship: sg.relationship,
            is_primary: sg.is_primary,
          }));

          const { error: guardianError } = await supabase
            .from('student_guardians')
            .insert(guardianInserts);

          if (guardianError) throw guardianError;
        }
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please try again.');
    }
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.first_name} ${student.last_name}? This will remove all payment obligations and guardian relationships for this student.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id);

      if (error) throw error;

      loadData();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };

  const handleAddExistingGuardian = (guardian: Guardian) => {
    if (studentGuardians.some((sg) => sg.guardian_id === guardian.id)) {
      alert('This guardian is already added.');
      return;
    }

    const hasPrimary = studentGuardians.some((sg) => sg.is_primary);

    setStudentGuardians([
      ...studentGuardians,
      {
        guardian_id: guardian.id,
        guardian: guardian,
        relationship: 'Parent',
        is_primary: !hasPrimary,
      },
    ]);
    setShowGuardianSearch(false);
    setGuardianSearchTerm('');
  };

  const handleCreateNewGuardian = async () => {
    if (!newGuardianData.first_name || !newGuardianData.last_name) {
      alert('First name and last name are required.');
      return;
    }

    try {
      const accessToken = Math.random().toString(36).substring(2, 15);

      const { data: newGuardian, error } = await supabase
        .from('guardians')
        .insert({
          ...newGuardianData,
          access_token: accessToken,
        })
        .select()
        .single();

      if (error) throw error;

      setAllGuardians([...allGuardians, newGuardian]);

      const hasPrimary = studentGuardians.some((sg) => sg.is_primary);

      setStudentGuardians([
        ...studentGuardians,
        {
          guardian_id: newGuardian.id,
          guardian: newGuardian,
          relationship: 'Parent',
          is_primary: !hasPrimary,
        },
      ]);

      setShowNewGuardianForm(false);
      setNewGuardianData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        whatsapp: '',
      });
    } catch (error) {
      console.error('Error creating guardian:', error);
      alert('Failed to create guardian. Please try again.');
    }
  };

  const handleRemoveGuardian = (guardianId: string) => {
    const removed = studentGuardians.find((sg) => sg.guardian_id === guardianId);
    const updated = studentGuardians.filter((sg) => sg.guardian_id !== guardianId);

    if (removed?.is_primary && updated.length > 0) {
      updated[0].is_primary = true;
    }

    setStudentGuardians(updated);
  };

  const handleSetPrimaryGuardian = (guardianId: string) => {
    setStudentGuardians(
      studentGuardians.map((sg) => ({
        ...sg,
        is_primary: sg.guardian_id === guardianId,
      }))
    );
  };

  const handleUpdateRelationship = (guardianId: string, relationship: string) => {
    setStudentGuardians(
      studentGuardians.map((sg) =>
        sg.guardian_id === guardianId ? { ...sg, relationship } : sg
      )
    );
  };

  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const studentId = student.student_id.toLowerCase();
    return fullName.includes(searchLower) || studentId.includes(searchLower);
  });

  const filteredGuardians = allGuardians.filter((guardian) => {
    if (!guardianSearchTerm) return true;
    const searchLower = guardianSearchTerm.toLowerCase();
    const fullName = `${guardian.first_name} ${guardian.last_name}`.toLowerCase();
    const email = guardian.email?.toLowerCase() || '';
    const phone = guardian.phone?.toLowerCase() || '';
    return fullName.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">Manage student records and class assignments</p>
          </div>
          <button
            onClick={() => openDialog()}
            className="flex items-center gap-2 px-4 py-2 bg-school-red-600 text-white rounded-lg hover:bg-school-red-700 transition-colors"
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or student ID..."
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
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(student.date_of_birth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.class ? `${student.class.grade} - ${student.class.section}` : (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDialog(student)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit student"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'No students found matching your search.' : 'No students yet. Add your first student to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingStudent ? 'Edit Student' : 'Add Student'}
              </h2>
              <button
                onClick={closeDialog}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                >
                  <option value="">No class assigned</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.grade} - {cls.section}
                      {cls.teacher && ` (${cls.teacher.first_name} ${cls.teacher.last_name})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Guardians</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGuardianSearch(!showGuardianSearch);
                        setShowNewGuardianForm(false);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Search size={16} />
                      Search Existing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewGuardianForm(!showNewGuardianForm);
                        setShowGuardianSearch(false);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <UserPlus size={16} />
                      Create New
                    </button>
                  </div>
                </div>

                {showGuardianSearch && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      placeholder="Search guardians by name, email, or phone..."
                      value={guardianSearchTerm}
                      onChange={(e) => setGuardianSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredGuardians.map((guardian) => (
                        <div
                          key={guardian.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {guardian.first_name} {guardian.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {guardian.email && <span>{guardian.email}</span>}
                              {guardian.email && guardian.phone && <span> • </span>}
                              {guardian.phone && <span>{guardian.phone}</span>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddExistingGuardian(guardian)}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                      {filteredGuardians.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No guardians found. Try a different search or create a new guardian.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showNewGuardianForm && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="font-medium text-gray-900">Create New Guardian</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First Name *"
                        value={newGuardianData.first_name}
                        onChange={(e) =>
                          setNewGuardianData({ ...newGuardianData, first_name: e.target.value })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Last Name *"
                        value={newGuardianData.last_name}
                        onChange={(e) =>
                          setNewGuardianData({ ...newGuardianData, last_name: e.target.value })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={newGuardianData.email}
                      onChange={(e) =>
                        setNewGuardianData({ ...newGuardianData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={newGuardianData.phone}
                        onChange={(e) =>
                          setNewGuardianData({ ...newGuardianData, phone: e.target.value })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp"
                        value={newGuardianData.whatsapp}
                        onChange={(e) =>
                          setNewGuardianData({ ...newGuardianData, whatsapp: e.target.value })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateNewGuardian}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create Guardian
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {studentGuardians.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      No guardians added yet. Search for existing guardians or create a new one.
                    </div>
                  ) : (
                    studentGuardians.map((sg) => (
                      <div
                        key={sg.guardian_id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryGuardian(sg.guardian_id)}
                          className={`p-1 rounded transition-colors ${
                            sg.is_primary
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                          title={sg.is_primary ? 'Primary guardian' : 'Set as primary'}
                        >
                          <Star size={20} fill={sg.is_primary ? 'currentColor' : 'none'} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {sg.guardian?.first_name} {sg.guardian?.last_name}
                            {sg.is_primary && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sg.guardian?.email && <span>{sg.guardian.email}</span>}
                            {sg.guardian?.email && sg.guardian?.phone && <span> • </span>}
                            {sg.guardian?.phone && <span>{sg.guardian.phone}</span>}
                          </div>
                        </div>
                        <select
                          value={sg.relationship}
                          onChange={(e) =>
                            handleUpdateRelationship(sg.guardian_id, e.target.value)
                          }
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-school-red-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="Parent">Parent</option>
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Other">Other</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveGuardian(sg.guardian_id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove guardian"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
