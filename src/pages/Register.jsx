import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Register = () => {
  const navigate = useNavigate();
  const { registerPatient } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    // Validate password
    if (formData.password.length < 3) {
      setMessage('Password must be at least 3 characters');
      return;
    }

    const { success, message: errMsg } = await registerPatient({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (success) {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setMessage(errMsg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 shadow-card">
      <h2 className="text-center text-3xl font-semibold text-secondary">Create a patient account</h2>
      <p className="mt-2 text-center text-sm text-gray-500">Doctor and Admin access are provisioned internally.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none"
          />
        </div>

        <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary">
          Register
        </button>
      </form>

      {message && <p className="mt-6 rounded-2xl bg-accent/40 px-4 py-3 text-center text-sm text-secondary">{message}</p>}
    </div>
  );
};

export default Register;

