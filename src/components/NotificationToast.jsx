import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const NotificationToast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <FiCheckCircle className="text-green-500" />,
    error: <FiAlertCircle className="text-red-500" />,
    info: <FiInfo className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`fixed top-20 right-4 z-50 animate-slide-in-right ${bgColors[type]} border rounded-xl shadow-lg p-4 min-w-[300px] max-w-md`}>
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;

