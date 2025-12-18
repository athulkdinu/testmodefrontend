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
                    // Check multiple conditions
                    const hasData = videoElement.readyState >= 2; // HAVE_CURRENT_DATA or higher
                    const isPlaying = !videoElement.paused && videoElement.currentTime > 0;
                    
                    if (hasData || isPlaying) {
                        console.log('✅ VideoPlayer - Video element is ready for user:', user.uid, {
                            readyState: videoElement.readyState,
                            paused: videoElement.paused,
                            currentTime: videoElement.currentTime
                        });
                        setHasVideo(true);
                        setError(null);
                        return true;
                    }
                }
                return false;
            };

            // Listen for video events
            const handleCanPlay = () => {
                console.log('✅ VideoPlayer - Video can play for user:', user.uid);
                setHasVideo(true);
                setError(null);
            };

            const handlePlaying = () => {
                console.log('✅ VideoPlayer - Video is playing for user:', user.uid);
                setHasVideo(true);
                setError(null);
            };

            const handleLoadedData = () => {
                console.log('✅ VideoPlayer - Video loaded data for user:', user.uid);
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
            videoElement.addEventListener('error', handleError);
            
            // Fallback: Check periodically if video is playing but events didn't fire
            let checkInterval = null;

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
                                        // Force set hasVideo if track is playing
                                        if (videoTrack.isPlaying) {
                                            console.log('✅ VideoPlayer - Track is playing, setting hasVideo to true');
                                            setHasVideo(true);
                                        }
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
                    setTimeout(() => {
                        if (!checkVideoPlaying()) {
                            // Wait a bit more for video to load
                            setTimeout(() => {
                                if (!checkVideoPlaying()) {
                                    // Force set hasVideo if track is playing
                                    if (videoTrack.isPlaying) {
                                        console.log('✅ VideoPlayer - Track is playing (sync), setting hasVideo to true');
                                        setHasVideo(true);
                                    }
                                }
                            }, 1000);
                        }
                    }, 200);
                }
                
                // Start interval check as fallback (in case events don't fire)
                // Use a ref to track if we've already set hasVideo to avoid stale closure
                let videoDetected = false;
                checkInterval = setInterval(() => {
                    if (videoElement && !videoDetected && !error && videoTrack) {
                        const hasData = videoElement.readyState >= 2;
                        const isPlaying = !videoElement.paused && videoElement.currentTime > 0;
                        const trackPlaying = videoTrack.isPlaying;
                        const hasVideoSrc = videoElement.srcObject !== null;
                        
                        if (hasData || isPlaying || trackPlaying || hasVideoSrc) {
                            console.log('✅ VideoPlayer - Video detected via interval check for user:', user.uid, {
                                hasData,
                                isPlaying,
                                trackPlaying,
                                hasVideoSrc,
                                readyState: videoElement.readyState
                            });
                            setHasVideo(true);
                            setError(null);
                            videoDetected = true;
                            if (checkInterval) {
                                clearInterval(checkInterval);
                                checkInterval = null;
                            }
                        }
                    }
                }, 500); // Check every 500ms
            } catch (err) {
                console.error('❌ VideoPlayer - Error playing video track:', err);
                setError('Error playing video');
                setHasVideo(false);
            }

            return () => {
                // Clear interval
                if (checkInterval) {
                    clearInterval(checkInterval);
                }
                
                // Remove event listeners
                videoElement.removeEventListener('canplay', handleCanPlay);
                videoElement.removeEventListener('playing', handlePlaying);
                videoElement.removeEventListener('loadeddata', handleLoadedData);
                videoElement.removeEventListener('error', handleError);
                
                // Cleanup
                if (videoTrack && ref.current) {
                    try {
                        if (videoTrack.isPlaying) {
                            videoTrack.stop();
                        }
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
