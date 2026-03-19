import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Check, Search, Filter, X, UserPlus, Upload, FileImage, Calendar, Plus, Trash2 } from 'lucide-react';
import { ScheduleSelector, ScheduleEntry } from '../../components/ScheduleSelector';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_id: string;
  class: {
    id: string;
    grade: string;
    section: string;
  };
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

interface Schedule {
  id: string;
  send_via_whatsapp: boolean;
  send_via_email: boolean;
  scheduled_datetime: string;
}

export function CreatePaymentItem() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [showIconModal, setShowIconModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activitySchedule, setActivitySchedule] = useState<ScheduleEntry[]>([]);
  const [formData, setFormData] = useState({
    category: 'Term Fees',
    title: '',
    description: '',
    location: 'At school',
    amount: '',
    due_date: '',
    bank_transfer_enabled: true,
    wipay_enabled: true,
    cash_enabled: true,
    whatsapp_notifications: true,
    email_notifications: true,
    eligible_students: [] as string[],
    all_students: true,
    is_mandatory: true,
    max_capacity: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: studentsData } = await supabase
      .from('students')
      .select('*, class:classes(id, grade, section)')
      .order('first_name', { ascending: true });
    if (studentsData) setStudents(studentsData);

    const { data: classesData } = await supabase
      .from('classes')
      .select('*, teacher:teachers(first_name, last_name)')
      .order('grade', { ascending: true });
    if (classesData) setClasses(classesData);
  };

  //icons
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const icon = e.target.files?.[0];
    if (icon) {
      if (icon.type.startsWith('image/')) {
        setSelectedIcon(icon);
        const reader = new FileReader();
        reader.onloadend = () => {
          setIconPreview(reader.result as string);
        };
        reader.readAsDataURL(icon);
      } else {
        alert('Please select an image icon');
      }
    }
  };

  const removeIcon = () => {
    setSelectedIcon(null);
    setIconPreview(null);
  };

  //files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  
  const addSchedule = () => {
    const newSchedule: Schedule = {
      id: crypto.randomUUID(),
      send_via_whatsapp: false,
      send_via_email: false,
      scheduled_datetime: '',
    };
    setSchedules([...schedules, newSchedule]);
  };

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const updateSchedule = (id: string, field: keyof Schedule, value: boolean | string) => {
    setSchedules(
      schedules.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    //attached icon
    let iconUrl = null;

    if (selectedIcon) {
      const iconExt = selectedIcon.name.split('.').pop();
      const iconName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${iconExt}`;
      const iconPath = `${iconName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-item-icons')
        .upload(iconPath, selectedIcon);

      if (uploadError) {
        console.error('Error uploading icon:', uploadError);
        alert('Failed to upload icon. Please try again.');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('payment-item-icons')
        .getPublicUrl(iconPath);

      iconUrl = urlData.publicUrl;
    }
    
    //attached file
    let fileUrl = null;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-item-files')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        alert('Failed to upload file. Please try again.');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('payment-item-files')
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl;
    }

    const { data: paymentItem } = await supabase
      .from('payment_items')
      .insert([
        {
          category: formData.category,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          schedule: activitySchedule.length > 0 ? activitySchedule : null,
          amount: parseFloat(formData.amount),
          due_date: formData.due_date,
          status: 'Active',
          bank_transfer_enabled: formData.bank_transfer_enabled,
          wipay_enabled: formData.wipay_enabled,
          cash_enabled: formData.cash_enabled,
          whatsapp_notifications: formData.whatsapp_notifications,
          email_notifications: formData.email_notifications,
          icon_url: iconUrl,
          file_url: fileUrl,
          is_mandatory: formData.is_mandatory,
          max_capacity: formData.max_capacity,
        },
      ])
      .select()
      .single();

    if (paymentItem) {
      const studentIds = formData.all_students
        ? students.map((s) => s.id)
        : formData.eligible_students;

      await supabase.from('payment_item_students').insert(
        studentIds.map((studentId) => ({
          payment_item_id: paymentItem.id,
          student_id: studentId,
        }))
      );

      for (const studentId of studentIds) {
        await supabase.from('payments').insert([
          {
            student_id: studentId,
            payment_item_id: paymentItem.id,
            status: 'Unpaid',
            amount: parseFloat(formData.amount),
          },
        ]);
      }

      if (schedules.length > 0) {
        await supabase.from('payment_schedules').insert(
          schedules.map((schedule) => ({
            payment_item_id: paymentItem.id,
            send_via_whatsapp: schedule.send_via_whatsapp,
            send_via_email: schedule.send_via_email,
            scheduled_datetime: schedule.scheduled_datetime,
          }))
        );
      }

      navigate('/admin/payment-items');
    }
  };

  const addStudent = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      eligible_students: [...prev.eligible_students, studentId],
    }));
  };

  const removeStudent = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      eligible_students: prev.eligible_students.filter((id) => id !== studentId),
    }));
  };

  const addAllFromClass = (classId: string) => {
    const classStudents = students.filter(s => s.class_id === classId);
    const newStudentIds = classStudents
      .filter(s => !formData.eligible_students.includes(s.id))
      .map(s => s.id);

    setFormData((prev) => ({
      ...prev,
      eligible_students: [...prev.eligible_students, ...newStudentIds],
    }));
  };

  const selectedStudents = students.filter(s => formData.eligible_students.includes(s.id));

  const availableStudents = students.filter(s => {
    if (formData.eligible_students.includes(s.id)) return false;
    if (classFilter !== 'all' && s.class_id !== classFilter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
      return fullName.includes(searchLower);
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/payment-items')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-school-red-700">
              Create Payment Item
            </h1>
            <p className="text-gray-600 mt-1">Step {step} of 2</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="Term Fees">Term Fees</option>
                    <option value="Club">Club</option>
                    <option value="Event Ticket">Event Ticket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                    placeholder="e.g., Term 1 Fees 2026/27"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Additional details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                    placeholder="e.g., At school, School Hall, Playground"
                  />
                </div>

                <ScheduleSelector
                  schedule={activitySchedule}
                  onChange={setActivitySchedule}
                />

                {/* Add Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Optional)
                  </label>
                  {!selectedIcon ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> an image icon
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleIconChange}
                      />
                    </label>
                  ) : (
                    <div className="relative border-2 border-gray-300 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={removeIcon}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-center gap-4">
                        {iconPreview && (
                          <img
                            src={iconPreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <FileImage size={18} />
                            {selectedIcon.name}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {(selectedIcon.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Add Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment (Optional)
                  </label>
                  {!selectedFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> an image
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
                    <div className="relative border-2 border-gray-300 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-center gap-4">
                        {filePreview && (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <FileImage size={18} />
                            {selectedFile.name}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (TTD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Item Type
                  </label>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.is_mandatory}
                        onChange={() => setFormData({ ...formData, is_mandatory: true, max_capacity: 0 })}
                        className="w-5 h-5 text-school-red-600 mt-0.5"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Mandatory</div>
                        <div className="text-sm text-gray-600">All assigned students must pay this item</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.is_mandatory}
                        onChange={() => setFormData({ ...formData, is_mandatory: false })}
                        className="w-5 h-5 text-school-red-600 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Opt-in</div>
                        <div className="text-sm text-gray-600 mb-3">Students can choose to enroll (e.g., clubs, events)</div>
                        {!formData.is_mandatory && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Capacity
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.max_capacity}
                              onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none"
                              placeholder="Enter maximum number of students"
                              required={!formData.is_mandatory}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Maximum number of students who can enroll in this opt-in item
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Methods
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.bank_transfer_enabled}
                        onChange={(e) =>
                          setFormData({ ...formData, bank_transfer_enabled: e.target.checked })
                        }
                        className="w-5 h-5 text-school-red-600 rounded focus:ring-school-red-500"
                      />
                      <span>Bank Transfer</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.wipay_enabled}
                        onChange={(e) =>
                          setFormData({ ...formData, wipay_enabled: e.target.checked })
                        }
                        className="w-5 h-5 text-school-red-600 rounded focus:ring-school-red-500"
                      />
                      <span>WiPay Card</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.cash_enabled}
                        onChange={(e) =>
                          setFormData({ ...formData, cash_enabled: e.target.checked })
                        }
                        className="w-5 h-5 text-school-red-600 rounded focus:ring-school-red-500"
                      />
                      <span>Cash</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.whatsapp_notifications}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp_notifications: e.target.checked })
                        }
                        className="w-5 h-5 text-school-red-600 rounded focus:ring-school-red-500"
                      />
                      <span>WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.email_notifications}
                        onChange={(e) =>
                          setFormData({ ...formData, email_notifications: e.target.checked })
                        }
                        className="w-5 h-5 text-school-red-600 rounded focus:ring-school-red-500"
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-school-red-600 hover:bg-school-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {formData.is_mandatory ? 'Next: Select Students' : 'Next: Notifications & Preview'}
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Eligible Students
                    </label>
                    <label className="flex items-center gap-3 mb-4 p-4 bg-school-red-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.all_students}
                        onChange={(e) =>
                          setFormData({ ...formData, all_students: e.target.checked })
                        }
                        className="w-5 h-5 text-school-red-600 rounded focus:ring-school-red-500"
                      />
                      <span className="font-medium">All Students</span>
                    </label>

                    {!formData.all_students && (
                    <div className="space-y-4">
                      {selectedStudents.length > 0 && (
                        <div className="border border-gray-300 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 mb-3">
                            Selected Students ({selectedStudents.length})
                          </h3>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {selectedStudents.map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between p-2 bg-school-red-50 rounded-lg"
                              >
                                <span className="text-sm">
                                  {student.first_name} {student.last_name} - {student.class?.grade} {student.class?.section}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeStudent(student.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border border-gray-300 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-300">
                          <h3 className="font-medium text-gray-900 mb-3">Add Students</h3>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                              <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                              />
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
                                    {cls.grade} {cls.section}
                                  </option>
                                ))}
                              </select>
                              {classFilter !== 'all' && (
                                <button
                                  type="button"
                                  onClick={() => addAllFromClass(classFilter)}
                                  className="px-3 py-2 bg-school-red-600 hover:bg-school-red-700 text-white rounded-lg text-sm whitespace-nowrap transition-colors"
                                >
                                  Add All
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {availableStudents.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                              {searchTerm || classFilter !== 'all'
                                ? 'No students found matching your filters'
                                : 'All students have been added'}
                            </div>
                          ) : (
                            <div className="p-4 space-y-2">
                              {availableStudents.map((student) => (
                                <div
                                  key={student.id}
                                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                                >
                                  <span className="text-sm">
                                    {student.first_name} {student.last_name} - {student.class?.grade} {student.class?.section}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => addStudent(student.id)}
                                    className="text-school-red-600 hover:text-school-red-700 p-1"
                                  >
                                    <UserPlus size={18} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    )}
                  </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-school-red-600" size={20} />
                      <h3 className="font-medium text-gray-900">Notification Schedules</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addSchedule}
                      className="flex items-center gap-2 px-3 py-1.5 bg-school-red-600 hover:bg-school-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Add Schedule
                    </button>
                  </div>

                  {schedules.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No schedules added. Click "Add Schedule" to create notification schedules.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {schedules.map((schedule, index) => (
                        <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">Schedule {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Send Via
                              </label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={schedule.send_via_whatsapp}
                                    onChange={(e) =>
                                      updateSchedule(schedule.id, 'send_via_whatsapp', e.target.checked)
                                    }
                                    className="w-4 h-4 text-school-red-600 rounded focus:ring-school-red-500"
                                  />
                                  <span className="text-sm text-gray-700">WhatsApp</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={schedule.send_via_email}
                                    onChange={(e) =>
                                      updateSchedule(schedule.id, 'send_via_email', e.target.checked)
                                    }
                                    className="w-4 h-4 text-school-red-600 rounded focus:ring-school-red-500"
                                  />
                                  <span className="text-sm text-gray-700">Email</span>
                                </label>
                              </div>
                              {!schedule.send_via_whatsapp && !schedule.send_via_email && (
                                <p className="text-xs text-red-600 mt-1">
                                  Please select at least one delivery method
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Scheduled Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                value={schedule.scheduled_datetime}
                                onChange={(e) =>
                                  updateSchedule(schedule.id, 'scheduled_datetime', e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-red-500 focus:border-transparent outline-none text-sm"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-school-cream p-4 rounded-lg">
                  <h3 className="font-semibold text-school-red-700 mb-2">Preview Message</h3>
                  {filePreview && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setShowImageModal(true)}
                        className="relative group"
                      >
                        <img
                          src={filePreview}
                          alt="Attachment"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-school-red-500 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                            Click to view full size
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-700">
                    Dear Parent/Guardian,
                    <br />
                    <br />
                    A new payment item has been created: <strong>{formData.title}</strong>
                    <br />
                    Amount: <strong>TTD {formData.amount}</strong>
                    <br />
                    Due Date: <strong>{formData.due_date}</strong>
                    <br />
                    <br />
                    Please visit the payment portal by clicking this{' '}
                    <a
                      href={`${window.location.origin}/guardian/pay/[TOKEN]`}
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [payment-item link]
                    </a>{' '}
                    to complete the payment.
                    <br />
                    <br />
                    Maria Regina Grade School
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-school-red-600 hover:bg-school-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Create Payment Item
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {showIconModal && iconPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowIconModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowIconModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={iconPreview}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      

      {showImageModal && filePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={filePreview}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
