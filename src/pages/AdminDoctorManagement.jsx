import { useState } from 'react';
import { FiTrash2, FiUserPlus, FiBriefcase, FiCheckCircle, FiXCircle, FiEdit2 } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const AdminDoctorManagement = () => {
  const { adminDoctors, addAdminDoctor, deleteAdminDoctor, user } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialty: '', experience: '', contact: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await addAdminDoctor(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Doctor added successfully!' });
        setFormData({ name: '', email: '', password: '', specialty: '', experience: '', contact: '' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add doctor' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding doctor' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (doctorId, doctorName) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${doctorName}?`)) return;
    setDeleting(doctorId);
    const result = await deleteAdminDoctor(doctorId);
    if (result && result.success) {
      setMessage({ type: 'success', text: 'Doctor deleted successfully!' });
    } else {
      setMessage({ type: 'error', text: result?.message || 'Failed to delete doctor' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <FiBriefcase className="text-3xl" />
          <div>
            <h1 className="text-2xl font-bold">Doctor Management</h1>
            <p className="text-green-100">Manage medical professionals and specialists</p>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <FiCheckCircle className="text-xl" />
          ) : (
            <FiXCircle className="text-xl" />
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Add Doctor Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <FiUserPlus className="text-xl text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-secondary">Add New Doctor</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Dr. John Doe"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="doctor@example.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Set password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <input
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                placeholder="e.g., Cardiology, Neurology"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <FiUserPlus /> Add Doctor
            </span>
          </button>
        </form>

        {/* Doctor List */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-3">
                <FiBriefcase className="text-xl text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary">Doctor Directory</h3>
                <p className="text-sm text-gray-500">{adminDoctors.length} registered doctors</p>
              </div>
            </div>
          </div>

          {adminDoctors.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {adminDoctors.map((doctor) => {
                const doctorId = doctor._id || doctor.id;
                const doctorName = doctor.name || doctor.userId?.name || 'Unknown';
                return (
                  <div
                    key={doctorId}
                    className="bg-gradient-to-r from-green-50 to-white rounded-xl p-5 border border-green-200 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-green-100 rounded-full p-3">
                          <FiBriefcase className="text-green-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-secondary text-lg">{doctorName}</p>
                          <p className="text-gray-600 text-sm mt-1">{doctor.userId?.email || 'No email'}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {doctor.specialty || 'General'}
                            </span>
                            {doctor.experience && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {doctor.experience} years exp.
                              </span>
                            )}
                            {doctor.contact && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {doctor.contact}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(doctorId, doctorName)}
                        disabled={deleting === doctorId}
                        className="bg-red-50 hover:bg-red-100 border-2 border-red-200 p-3 rounded-xl text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed ml-4"
                        title="Delete doctor"
                      >
                        {deleting === doctorId ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                        ) : (
                          <FiTrash2 className="text-xl" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No doctors found</p>
              <p className="text-sm text-gray-400 mt-1">Add your first doctor using the form</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDoctorManagement;
