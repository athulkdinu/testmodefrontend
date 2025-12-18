import { useEffect } from 'react';
import { FiPhone, FiPhoneOff, FiX } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const IncomingCallNotification = () => {
  const { incomingCall, acceptCall, rejectCall, clearIncomingCall } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (incomingCall) {
      // Play notification sound (optional)
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {
        // Ignore if audio fails
      });
    }
  }, [incomingCall]);

  if (!incomingCall) return null;

  const handleAccept = () => {
    acceptCall(incomingCall.channelName, incomingCall.from);
    // Navigate to video call - the acceptCall function will notify the caller
    setTimeout(() => {
      navigate(`/video-call?channel=${incomingCall.channelName}&name=${incomingCall.fromName}`);
    }, 100);
  };

  const handleReject = () => {
    rejectCall(incomingCall.from);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-pulse">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPhone className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Incoming Call</h3>
            <p className="text-lg text-gray-600">{incomingCall.fromName}</p>
            <p className="text-sm text-gray-500 mt-1">
              {incomingCall.type === 'patient-to-doctor' ? 'Patient is calling' : 'Doctor is calling'}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReject}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg"
            >
              <FiPhoneOff className="text-xl" />
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
            >
              <FiPhone className="text-xl" />
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;

