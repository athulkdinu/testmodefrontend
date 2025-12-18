import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import { getProfileAPI, updateProfileAPI } from '../services/allAPI';

const Profile = () => {
  const { user, appointments, medicines } = useAppContext();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getProfileAPI(reqHeader);
      if (result.status === 200) {
        const profileData = await result.json();
        setProfile(profileData);
        setEditedProfile({
          name: profileData.name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          dateOfBirth: profileData.dateOfBirth || '',
          gender: profileData.gender || '',
          contact: profileData.contact || ''
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await updateProfileAPI(editedProfile, reqHeader);
      if (result.status === 200) {
        setMessage("Profile updated successfully!");
        await fetchProfile();
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await result.json();
        setMessage(error.message || "Failed to update profile");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating profile");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        contact: profile.contact || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-6">Failed to load profile</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <BackButton />

      {message && (
        <div className={`p-4 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary">
            {editedProfile.name || user?.name || 'User'}'s Profile
          </h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm"
            >
              <FiEdit2 /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm"
              >
                <FiSave /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm"
              >
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* BASIC DETAILS */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border px-3 py-2 rounded-md mt-1"
              />
            ) : (
              <p className="font-medium mt-1">{editedProfile.name || 'N/A'}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border px-3 py-2 rounded-md mt-1"
              />
            ) : (
              <p className="font-medium mt-1">{editedProfile.phone || 'N/A'}</p>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div>
            <label className="text-sm text-gray-500">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full border px-3 py-2 rounded-md mt-1"
              />
            ) : (
              <p className="font-medium mt-1">{editedProfile.dateOfBirth || 'N/A'}</p>
            )}
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-gray-500">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full border px-3 py-2 rounded-md mt-1"
              />
            ) : (
              <p className="font-medium mt-1">{editedProfile.address || 'N/A'}</p>
            )}
          </div>

          {/* GENDER */}
          <div>
            <label className="text-sm text-gray-500">Gender</label>
            {isEditing ? (
              <select
                value={editedProfile.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full border px-3 py-2 rounded-md mt-1"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            ) : (
              <p className="font-medium mt-1">{editedProfile.gender}</p>
            )}
          </div>


          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium mt-1">{user?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-5 shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Appointments</p>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </div>
        <div className="bg-white p-5 shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Active Medicines</p>
          <p className="text-2xl font-bold">{medicines.length}</p>
        </div>
        <div className="bg-white p-5 shadow rounded-lg text-center">
          <p className="text-gray-500 text-sm">Health Score</p>
          <p className="text-2xl font-bold">92</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

        <div className="space-y-3">
          <Link
            to="/appointments"
            className="block w-full border px-4 py-3 rounded-md text-sm hover:bg-gray-50"
          >
            Book Appointment
          </Link>
          <Link
            to="/medicine-tracker"
            className="block w-full border px-4 py-3 rounded-md text-sm hover:bg-gray-50"
          >
            Add Medicine Reminder
          </Link>
          <Link
            to="/records"
            className="block w-full border px-4 py-3 rounded-md text-sm hover:bg-gray-50"
          >
            Upload Medical Record
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
