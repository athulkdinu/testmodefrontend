import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ user, style }) => {
    const ref = useRef();
    const [hasVideo, setHasVideo] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ref.current) return;

        const videoTrack = user.videoTrack;
        
        if (videoTrack) {
            console.log('VideoPlayer - Playing video track for user:', user.uid);
            console.log('VideoPlayer - Track state:', {
                isPlaying: videoTrack.isPlaying,
                muted: videoTrack.muted,
                enabled: videoTrack.enabled
            });

            try {
                // Stop any existing playback first
                videoTrack.stop();
                
                // Play the video track
                const playResult = videoTrack.play(ref.current);
                
                // play() might return a promise or undefined
                if (playResult && typeof playResult.then === 'function') {
                    // It's a promise
                    playResult.then(() => {
                        console.log('✅ VideoPlayer - Video track playing successfully for user:', user.uid);
                        setHasVideo(true);
                        setError(null);
                    }).catch((err) => {
                        console.error('❌ VideoPlayer - Failed to play video track:', err);
                        setError('Failed to play video');
                        setHasVideo(false);
                    });
                } else {
                    // Not a promise, assume it played successfully
                    console.log('✅ VideoPlayer - Video track playing (sync) for user:', user.uid);
                    setHasVideo(true);
                    setError(null);
                }
            } catch (err) {
                console.error('❌ VideoPlayer - Error playing video track:', err);
                setError('Error playing video');
                setHasVideo(false);
            }
        } else {
            // This is normal for remote users who haven't published video yet
            // Don't show as error, just wait for the track
            if (user.uid !== 'You') {
                console.log('VideoPlayer - Waiting for video track from user:', user.uid);
            } else {
                console.warn('VideoPlayer - No video track for local user');
            }
            setHasVideo(false);
        }

        return () => {
            // Cleanup
            if (videoTrack && ref.current) {
                try {
                    videoTrack.stop();
                    console.log('VideoPlayer - Stopped video track for user:', user.uid);
                } catch (err) {
                    console.error('VideoPlayer - Error stopping video track:', err);
                }
            }
        };
    }, [user, user?.videoTrack]);

    return (
        <div className={`relative overflow-hidden bg-gray-900 ${style}`}>
            <div
                ref={ref}
                className="h-full w-full object-cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            ></div>
            
            {/* Loading/Error State */}
            {!hasVideo && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">Loading video...</p>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center text-white">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                </div>
            )}
            
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
