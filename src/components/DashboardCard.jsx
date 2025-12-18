import { Link } from 'react-router-dom';

const DashboardCard = ({ title, description, icon, to, className = '' }) => (
  <Link
    to={to}
    className={`group rounded-3xl bg-white p-6 shadow-lg border border-gray-100 transition hover:-translate-y-1 hover:shadow-xl ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-secondary">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="ml-4">
        {icon}
      </div>
    </div>
  </Link>
);

export default DashboardCard;

