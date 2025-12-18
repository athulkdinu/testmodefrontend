import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const roles = [
  { label: 'Patient', value: 'patient' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Admin', value: 'admin' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({ role: 'patient', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData); // Await the async login
    setLoading(false);

    if (result.success) {
      navigate(`/${formData.role}/dashboard`);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 shadow-card">
      <h2 className="text-center text-3xl font-bold text-secondary">Welcome back</h2>
      {/* <p className="mt-2 text-center text-sm text-gray-500">Use the demo credentials to access each module.</p> */}



      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600">Select Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
              className="w-full border-0 bg-transparent focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="1234"
              className="w-full border-0 bg-transparent focus:outline-none"
              required
            />
          </div>
        </div>

        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New patient?{' '}
        <span
          role="link"
          tabIndex={0}
          className="cursor-pointer font-semibold text-secondary underline"
          onClick={() => navigate('/register')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/register')}
        >
          Register to get started
        </span>
      </p>
    </div>
  );
};

export default Login;

