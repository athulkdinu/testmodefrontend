import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ user, style }) => {
    const ref = useRef();

    useEffect(() => {
        // Agora expects a DOM element to play the video track
        // For local user, 'user' prop might be the local video track directly or a user object wrapper
        // We'll design this to accept the 'user' object from Agora SDK
        if (user.videoTrack) {
            user.videoTrack.play(ref.current);
        }

        return () => {
            // Cleanup if needed, though Agora handles stop usually
            if (user.videoTrack) {
                user.videoTrack.stop();
            }
        };
    }, [user]);

    return (
        <div className={`relative overflow-hidden bg-gray-900 ${style}`}>
            <div
                ref={ref}
                className="h-full w-full object-cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            ></div>
            {/* User Name/ID Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="text-white text-sm font-medium">
                    {user.displayName || (user.uid === 'You' ? 'You' : `User ${user.uid}`)}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
