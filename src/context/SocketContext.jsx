import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAppContext } from './AppContext';
import SERVERURL from '../services/serverURL';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAppContext();
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && user.token) {
      // Connect to Socket.IO server (Socket.IO runs on the same port as the backend)
      const socketUrl = SERVERURL || 'http://localhost:3000';
      const newSocket = io(socketUrl, {
        auth: {
          token: user.token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      newSocket.on('call:incoming', (data) => {
        console.log('Incoming call:', data);
        setIncomingCall(data);
      });

      newSocket.on('call:accepted', (data) => {
        console.log('Call accepted:', data);
        // Clear incoming call state and navigate to video call page
        setIncomingCall((currentCall) => {
          if (currentCall && data.channelName) {
            // Navigate to video call page after a brief delay to ensure state is cleared
            setTimeout(() => {
              window.location.href = `/video-call?channel=${data.channelName}&name=${currentCall.fromName || 'Participant'}`;
            }, 100);
          }
          return null;
        });
      });

      newSocket.on('call:rejected', (data) => {
        console.log('Call rejected:', data);
        setIncomingCall(null);
      });

      setSocket(newSocket);
      socketRef.current = newSocket;

      return () => {
        newSocket.close();
      };
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
      }
    }
  }, [user]);

  const initiateCall = (targetUserId, channelName, callerName, callType) => {
    if (!socket) return;

    if (callType === 'patient-to-doctor') {
      socket.emit('call:initiate', {
        doctorId: targetUserId,
        patientId: user.id || user._id,
        channelName,
        callerName
      });
    } else if (callType === 'doctor-to-patient') {
      socket.emit('call:initiate-doctor', {
        patientId: targetUserId,
        doctorId: user.id || user._id,
        channelName,
        callerName
      });
    }
  };

  const acceptCall = (channelName, fromUserId) => {
    if (!socket) return;
    socket.emit('call:accept', { channelName, toUserId: fromUserId });
    setIncomingCall(null);
  };

  const rejectCall = (fromUserId) => {
    if (!socket) return;
    socket.emit('call:reject', { toUserId: fromUserId });
    setIncomingCall(null);
  };

  const value = {
    socket,
    incomingCall,
    initiateCall,
    acceptCall,
    rejectCall,
    clearIncomingCall: () => setIncomingCall(null)
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

