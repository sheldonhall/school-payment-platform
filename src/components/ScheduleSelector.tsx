import { Plus, Trash2 } from 'lucide-react';

export interface ScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
}

interface ScheduleSelectorProps {
  schedule: ScheduleEntry[];
  onChange: (schedule: ScheduleEntry[]) => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function ScheduleSelector({ schedule, onChange }: ScheduleSelectorProps) {
  const addScheduleEntry = () => {
    onChange([
      ...schedule,
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
      },
    ]);
  };

  const removeScheduleEntry = (index: number) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    onChange(newSchedule);
  };

  const updateScheduleEntry = (
    index: number,
    field: keyof ScheduleEntry,
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    onChange(newSchedule);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Schedule (Optional)
        </label>
        <button
          type="button"
          onClick={addScheduleEntry}
          className="inline-flex items-center gap-1 text-sm text-school-red-600 hover:text-school-red-700 font-medium"
        >
          <Plus size={16} />
          Add Time Slot
        </button>
      </div>

      {schedule.length === 0 ? (
        <div className="text-sm text-gray-500 italic py-2">
          No schedule set. Click "Add Time Slot" to add scheduling information.
        </div>
      ) : (
        <div className="space-y-2">
          {schedule.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <select
                value={entry.day}
                onChange={(e) =>
                  updateScheduleEntry(index, 'day', e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-school-red-500 focus:border-school-red-500"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={entry.startTime}
                onChange={(e) =>
                  updateScheduleEntry(index, 'startTime', e.target.value)
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-school-red-500 focus:border-school-red-500"
              />

              <span className="text-gray-500">to</span>

              <input
                type="time"
                value={entry.endTime}
                onChange={(e) =>
                  updateScheduleEntry(index, 'endTime', e.target.value)
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-school-red-500 focus:border-school-red-500"
              />

              <button
                type="button"
                onClick={() => removeScheduleEntry(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove time slot"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
