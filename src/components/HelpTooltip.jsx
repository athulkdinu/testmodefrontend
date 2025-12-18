import { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const HelpTooltip = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-gray-400 hover:text-primary transition"
      >
        <FiHelpCircle />
      </button>
      {isVisible && (
        <div
          className={`absolute ${positions[position]} z-50 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap pointer-events-none`}
        >
          {content}
          <div
            className={`absolute ${
              position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-t-4 border-t-gray-800' :
              position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-b-4 border-b-gray-800' :
              position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-800' :
              'right-full top-1/2 transform -translate-y-1/2 border-r-4 border-r-gray-800'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;

