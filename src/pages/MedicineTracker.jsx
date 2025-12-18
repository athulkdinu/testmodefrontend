import { useState } from 'react';
import { FiBell, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const MedicineTracker = () => {
  const { medicines, addMedicine, removeMedicine } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: 'daily',
  });

  const [takenMedicines, setTakenMedicines] = useState(new Set());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMedicine(formData);
    setFormData({ name: '', dosage: '', time: '', frequency: 'daily' });
  };

  const toggleTaken = (id) => {
    setTakenMedicines((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-6 p-4">
      <BackButton />

      {/* Add Medicine Card */}
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-secondary">Add Medicine</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Medicine Name"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary"
            required
          />

          <input
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Dosage (e.g., 10mg)"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary"
            required
          />

          <input
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Time (e.g., 08:00 AM)"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary"
            required
          />

          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary"
          >
            <option value="daily">Daily</option>
            <option value="twice-daily">Twice Daily</option>
            <option value="weekly">Weekly</option>
            <option value="as-needed">As Needed</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-secondary"
          >
            Add Reminder
          </button>
        </form>
      </div>

      {/* Medicine List */}
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary mb-4">
          <FiBell /> Medicine Reminders
        </h3>

        {medicines.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {medicines.map((medicine) => {
              const medicineId = medicine._id || medicine.id;
              const isTaken = takenMedicines.has(medicineId);
              return (
                <li
                  key={medicineId}
                  className={`flex justify-between items-center rounded-2xl p-4 transition ${
                    isTaken ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-secondary flex items-center gap-2">
                      {medicine.name}
                      {isTaken && <FiCheckCircle className="text-green-500" />}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {medicine.dosage} • {medicine.time || 'N/A'} • {medicine.frequency}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTaken(medicineId)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        isTaken
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isTaken ? 'Taken' : 'Mark Taken'}
                    </button>

                    <button
                      onClick={() => removeMedicine(medicineId)}
                      className="rounded-full border border-red-200 p-2 text-red-400 hover:bg-red-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No medicines added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicineTracker;
