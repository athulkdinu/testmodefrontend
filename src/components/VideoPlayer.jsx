import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ user, style }) => {
    const ref = useRef();
    const [hasVideo, setHasVideo] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ref.current) return;

        const videoTrack = user.videoTrack;
        const videoElement = ref.current;
        
        if (videoTrack) {
            console.log('VideoPlayer - Playing video track for user:', user.uid);
            console.log('VideoPlayer - Track state:', {
                isPlaying: videoTrack.isPlaying,
                muted: videoTrack.muted,
                enabled: videoTrack.enabled,
                trackId: videoTrack.trackId
            });

            // Function to check if video is actually playing
            const checkVideoPlaying = () => {
                if (videoElement) {
                    const readyState = videoElement.readyState;
                    const hasVideoSrc = videoElement.srcObject !== null || videoElement.src !== '';
                    
                    console.log('VideoPlayer - Checking video state:', {
                        readyState,
                        hasVideoSrc,
                        videoWidth: videoElement.videoWidth,
                        videoHeight: videoElement.videoHeight,
                        paused: videoElement.paused
                    });
                    
                    if (readyState >= 2 || hasVideoSrc || videoElement.videoWidth > 0) {
                        console.log('✅ VideoPlayer - Video element is ready for user:', user.uid);
                        setHasVideo(true);
                        setError(null);
                        return true;
                    }
                }
                return false;
            };

            // Listen for video events
            const handleCanPlay = () => {
                console.log('✅ VideoPlayer - Video can play event for user:', user.uid);
                setHasVideo(true);
                setError(null);
            };

            const handlePlaying = () => {
                console.log('✅ VideoPlayer - Video is playing event for user:', user.uid);
                setHasVideo(true);
                setError(null);
            };

            const handleLoadedData = () => {
                console.log('✅ VideoPlayer - Video loaded data for user:', user.uid);
                setHasVideo(true);
                setError(null);
            };

            const handleLoadedMetadata = () => {
                console.log('✅ VideoPlayer - Video loaded metadata for user:', user.uid);
                setHasVideo(true);
                setError(null);
            };

            const handleError = (e) => {
                console.error('❌ VideoPlayer - Video element error for user:', user.uid, e);
                setError('Video playback error');
                setHasVideo(false);
            };

            // Add event listeners
            videoElement.addEventListener('canplay', handleCanPlay);
            videoElement.addEventListener('playing', handlePlaying);
            videoElement.addEventListener('loadeddata', handleLoadedData);
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.addEventListener('error', handleError);

            try {
                // Stop any existing playback first
                if (videoTrack.isPlaying) {
                    videoTrack.stop();
                }
                
                // Play the video track
                console.log('VideoPlayer - Calling play() on video track for user:', user.uid);
                const playResult = videoTrack.play(videoElement);
                
                // play() might return a promise or undefined
                if (playResult && typeof playResult.then === 'function') {
                    // It's a promise
                    playResult.then(() => {
                        console.log('✅ VideoPlayer - Video track play() resolved for user:', user.uid);
                        // Check if video is actually ready
                        setTimeout(() => {
                            if (!checkVideoPlaying()) {
                                // Wait a bit more for video to load
                                setTimeout(() => {
                                    if (!checkVideoPlaying()) {
                                        // Force set hasVideo after longer wait
                                        console.log('VideoPlayer - Force setting hasVideo after delay for user:', user.uid);
                                        setHasVideo(true);
                                    }
                                }, 1000);
                            }
                        }, 200);
                    }).catch((err) => {
                        console.error('❌ VideoPlayer - Failed to play video track:', err);
                        setError('Failed to play video');
                        setHasVideo(false);
                    });
                } else {
                    // Not a promise, check if video is ready
                    console.log('✅ VideoPlayer - Video track play() called (sync) for user:', user.uid);
                    // For remote tracks, be more aggressive about showing video
                    // If track exists and play() was called, assume it will work
                    setTimeout(() => {
                        if (!checkVideoPlaying()) {
                            // Wait a bit more for video to load
                            setTimeout(() => {
                                // Force set hasVideo if track exists - video should be playing
                                console.log('VideoPlayer - Force setting hasVideo (track exists) for user:', user.uid);
                                setHasVideo(true);
                            }, 500);
                        }
                    }, 200);
                }
                
                // Additional fallback: if track exists, show video after 2 seconds regardless
                setTimeout(() => {
                    if (videoTrack && !hasVideo && !error) {
                        console.log('VideoPlayer - Fallback: Force showing video after timeout for user:', user.uid);
                        setHasVideo(true);
                    }
                }, 2000);
            } catch (err) {
                console.error('❌ VideoPlayer - Error playing video track:', err);
                setError('Error playing video');
                setHasVideo(false);
            }

            return () => {
                // Remove event listeners
                videoElement.removeEventListener('canplay', handleCanPlay);
                videoElement.removeEventListener('playing', handlePlaying);
                videoElement.removeEventListener('loadeddata', handleLoadedData);
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                videoElement.removeEventListener('error', handleError);
                
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
    }, [user, user?.videoTrack]);

    return (
        <div className={`relative overflow-hidden bg-gray-900 ${style}`}>
            <div
                ref={ref}
                className="h-full w-full object-cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                autoPlay
                playsInline
            ></div>
            
            {/* Loading/Error State - Only show if we have a track but it's not ready yet */}
            {!hasVideo && !error && videoTrack && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">Loading video...</p>
                        <p className="text-xs text-gray-400 mt-1">Track available, waiting for stream</p>
                    </div>
                </div>
            )}
            
            {/* Show video element even if hasVideo is false - sometimes it works anyway */}
            {videoTrack && (
                <div className="absolute inset-0 z-0">
                    {/* Video will render here via ref */}
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
