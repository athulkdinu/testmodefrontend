import { useState, useEffect } from 'react';
import { FiClock, FiSave } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import { getProfileAPI, updateDoctorProfileAPI } from '../services/allAPI';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const DoctorSchedule = () => {
  const { user } = useAppContext();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, [user]);

  const fetchSchedule = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getProfileAPI(reqHeader);
      if (result.status === 200) {
        const profile = await result.json();
        if (profile.doctorDetails && profile.doctorDetails.schedule) {
          setSchedule(profile.doctorDetails.schedule);
        } else {
          // Initialize empty schedule
          const emptySchedule = daysOfWeek.map(day => ({ day, slots: [] }));
          setSchedule(emptySchedule);
        }
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      // Initialize empty schedule on error
      const emptySchedule = daysOfWeek.map(day => ({ day, slots: [] }));
      setSchedule(emptySchedule);
    } finally {
      setLoading(false);
    }
  };

  const toggleSlot = (dayIndex, slot) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      const daySchedule = newSchedule[dayIndex];
      const slotIndex = daySchedule.slots.indexOf(slot);
      
      if (slotIndex > -1) {
        // Remove slot
        daySchedule.slots = daySchedule.slots.filter(s => s !== slot);
      } else {
        // Add slot
        daySchedule.slots = [...daySchedule.slots, slot].sort();
      }
      
      return newSchedule;
    });
  };

  const handleSave = async () => {
    if (!user || !user.token) return;
    setSaving(true);
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await updateDoctorProfileAPI({ schedule }, reqHeader);
      if (result.status === 200) {
        setMessage("Schedule saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save schedule");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      setMessage("Error saving schedule");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-center py-10 text-gray-500">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-secondary">Weekly Schedule Overview</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50"
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
          {schedule.map((daySchedule, dayIndex) => (
            <article key={daySchedule.day} className="rounded-2xl border border-accent/40 p-4">
              <h3 className="text-lg font-semibold text-secondary mb-3">{daySchedule.day}</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = daySchedule.slots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(dayIndex, slot)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-surface text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiClock className={isSelected ? 'text-white' : 'text-primary'} />
                      {slot}
                    </button>
                  );
                })}
              </div>

              {daySchedule.slots.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">Selected slots:</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {daySchedule.slots.map((slot) => (
                      <li key={slot} className="flex items-center gap-2">
                  <FiClock className="text-primary" />
                  {slot}
                </li>
              ))}
            </ul>
                </div>
              )}
          </article>
        ))}
      </div>
    </div>
    </div>
  );
};

export default DoctorSchedule;

