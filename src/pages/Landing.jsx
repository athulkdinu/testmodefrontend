import { Link } from 'react-router-dom';
import { FiActivity, FiCalendar, FiShield, FiUserCheck } from 'react-icons/fi';

const featureItems = [
  {
    icon: <FiCalendar />,
    title: 'Smart Scheduling',
    description: 'Quick appointment booking and management.',
  },
  {
    icon: <FiActivity />,
    title: 'Real-time Insights',
    description: 'View health stats and reports easily.',
  },
  {
    icon: <FiUserCheck />,
    title: 'Personalized Care',
    description: 'Different dashboards for each role.',
  },
  {
    icon: <FiShield />,
    title: 'Secure Records',
    description: 'Data is encrypted and safeguarded.',
  },
];

const Landing = () => (
  <div className="p-10 space-y-20">

    {/* Hero Section */}
    <section className="text-center space-y-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
        Smart Health Management
      </p>

      <h1 className="text-3xl font-bold text-secondary md:text-4xl">
        A unified health system for smoother care.
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto">
        Manage appointments, medicine logs, diagnostics, and reporting for patients, doctors, and admins in a single platform.
      </p>

      <div className="flex gap-4 justify-center pt-2">
        <Link
          to="/login"
          className="rounded-md bg-primary px-6 py-3 font-semibold text-white hover:bg-secondary transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-md border border-secondary px-6 py-3 font-semibold text-secondary hover:bg-secondary hover:text-white transition"
        >
          Register
        </Link>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-secondary mb-6">
        Key Features
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {featureItems.map((feature) => (
          <div
            key={feature.title}
            className="flex gap-4 p-6 rounded-xl bg-white shadow-sm"
          >
            <div className="text-3xl text-primary">{feature.icon}</div>
            <div>
              <h3 className="font-semibold text-secondary">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

  </div>
);

export default Landing;
