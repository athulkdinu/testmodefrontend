import { useState } from 'react';
import { FiTrash2, FiUserPlus, FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const AdminUserManagement = () => {
  const { adminUsers, addAdminUser, deleteAdminUser } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleting, setDeleting] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addAdminUser(formData);
    if (result && result.success) {
      setMessage({ type: 'success', text: 'User added successfully!' });
      setFormData({ name: '', email: '', role: 'patient' });
    } else {
      setMessage({ type: 'error', text: result?.message || 'Failed to add user' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    setDeleting(userId);
    const result = await deleteAdminUser(userId);
    if (result && result.success) {
      setMessage({ type: 'success', text: 'User deleted successfully!' });
    } else {
      setMessage({ type: 'error', text: result?.message || 'Failed to delete user' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <FiUsers className="text-3xl" />
          <div>
            <h1 className="text-2xl font-bold">Patient Management</h1>
            <p className="text-blue-100">Manage patient accounts</p>
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
        {/* Add User Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 rounded-full p-3">
              <FiUserPlus className="text-xl text-blue-600" />
            </div>
                <h2 className="text-xl font-bold text-secondary">Add New Patient</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
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
                placeholder="user@example.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
              >
                <option value="patient">Patient</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Default password will be: password123</p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <FiUserPlus /> Add User
            </span>
          </button>
        </form>

        {/* Users List */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-3">
                <FiUsers className="text-xl text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary">All Users</h3>
                          <p className="text-sm text-gray-500">{adminUsers.length} total patients</p>
              </div>
            </div>
          </div>

          {adminUsers.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {adminUsers.map((user) => {
                const userId = user._id || user.id;
                return (
                  <div
                    key={userId}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-blue-100 rounded-full p-3">
                        <FiUsers className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-secondary text-lg">{user.name}</p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(userId, user.name)}
                      disabled={deleting === userId}
                      className="bg-red-50 hover:bg-red-100 border-2 border-red-200 p-3 rounded-xl text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      {deleting === userId ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <FiTrash2 className="text-xl" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiUsers className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No users found</p>
              <p className="text-sm text-gray-400 mt-1">Add your first user using the form</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
