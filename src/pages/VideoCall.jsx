import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from '../components/VideoPlayer';
import { appId, fetchToken } from '../agora/settings';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const VideoCall = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAppContext();
    
    // Get channel name from URL params, or use default
    // Format: ?channel=patient-123-doctor-456 or ?channel=mainRoom
    const channelName = searchParams.get('channel') || 'mainRoom';
    
    // Get participant info from URL params
    const participantName = searchParams.get('name') || 'Participant';
    
    // Debug: Log channel name
    console.log('VideoCall - Channel Name:', channelName);
    console.log('VideoCall - Participant Name:', participantName);
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const [localTracks, setLocalTracks] = useState([]); // [audioTrack, videoTrack]
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for token fetching
    const [showDebug, setShowDebug] = useState(false);
    const [connectionState, setConnectionState] = useState('DISCONNECTED');
    const [forceUpdate, setForceUpdate] = useState(0); // Force re-render when tracks update

    // Controls
    const [trackState, setTrackState] = useState({ video: true, audio: true });

    // Use ref to store client instance to avoid recreation
    const clientRef = useRef(null);

    // Event handlers (defined first to be used in setupEventListeners)
    const handleUserPublished = async (user, mediaType) => {
        try {
            console.log("📹 User published:", user.uid, mediaType);
            console.log("   User object:", {
                uid: user.uid,
                hasVideoTrack: !!user.videoTrack,
                hasAudioTrack: !!user.audioTrack
            });
            
            await clientRef.current.subscribe(user, mediaType);
            console.log("✅ Subscribe success", mediaType, "for user", user.uid);

            if (mediaType === "video") {
                console.log("   Processing video for user:", user.uid);
                
                // Immediately check for track after subscription
                const subscribedUser = clientRef.current.remoteUsers.find(u => u.uid === user.uid);
                if (subscribedUser && subscribedUser.videoTrack) {
                    console.log("   📹 Video track immediately available after subscribe:", {
                        uid: subscribedUser.uid,
                        trackId: subscribedUser.videoTrack.trackId,
                        enabled: subscribedUser.videoTrack.enabled
                    });
                    
                    // Add user immediately if track is available
                    setUsers((prevUsers) => {
                        const existingUser = prevUsers.find(u => u.uid === subscribedUser.uid);
                        if (!existingUser) {
                            console.log("➕ Adding user immediately with video track:", subscribedUser.uid);
                            setForceUpdate(prev => prev + 1);
                            return [...prevUsers, { ...subscribedUser }];
                        } else if (existingUser.videoTrack?.trackId !== subscribedUser.videoTrack?.trackId) {
                            console.log("   🔄 Updating user immediately with video track:", subscribedUser.uid);
                            setForceUpdate(prev => prev + 1);
                            return prevUsers.map(u => 
                                u.uid === subscribedUser.uid ? { ...subscribedUser } : u
                            );
                        }
                        return prevUsers;
                    });
                }
                
                // Function to update user with latest track from remoteUsers
                const updateUserWithTrack = (delay = 0) => {
                    setTimeout(() => {
                        // Always re-fetch from remoteUsers to get the latest track
                        const updatedUser = clientRef.current?.remoteUsers?.find(u => u.uid === user.uid);
                        if (updatedUser) {
                            console.log(`   User object after subscribe (${delay}ms delay):`, {
                                uid: updatedUser.uid,
                                hasVideoTrack: !!updatedUser.videoTrack,
                                videoTrackType: updatedUser.videoTrack?.constructor?.name,
                                enabled: updatedUser.videoTrack?.enabled,
                                muted: updatedUser.videoTrack?.muted,
                                isPlaying: updatedUser.videoTrack?.isPlaying,
                                trackId: updatedUser.videoTrack?.trackId
                            });
                            
                            // Only proceed if we have a video track
                            if (updatedUser.videoTrack) {
                                setUsers((prevUsers) => {
                                    const existingUser = prevUsers.find(u => u.uid === updatedUser.uid);
                                    if (existingUser) {
                                        // Check if the track is actually different
                                        if (existingUser.videoTrack?.trackId !== updatedUser.videoTrack?.trackId) {
                                            console.log("   🔄 Updating user with NEW video track:", updatedUser.uid, {
                                                oldTrackId: existingUser.videoTrack?.trackId,
                                                newTrackId: updatedUser.videoTrack?.trackId
                                            });
                                            const updated = prevUsers.map(u => {
                                                if (u.uid === updatedUser.uid) {
                                                    // Create new object with all properties to force React re-render
                                                    return { ...updatedUser };
                                                }
                                                return u;
                                            });
                                            setForceUpdate(prev => prev + 1); // Force re-render
                                            return updated;
                                        } else {
                                            // Track is the same, but ensure it's in the state
                                            console.log("   ✅ User already has this video track:", updatedUser.uid);
                                            return prevUsers;
                                        }
                                    }
                                    console.log("➕ Adding user to list with video track:", updatedUser.uid);
                                    setForceUpdate(prev => prev + 1); // Force re-render
                                    return [...prevUsers, { ...updatedUser }];
                                });
                            } else {
                                console.warn(`   ⚠️ Video track not available yet for user ${updatedUser.uid} (delay: ${delay}ms)`);
                            }
                        } else {
                            console.warn("   ⚠️ User not found in remoteUsers:", user.uid);
                        }
                    }, delay);
                };
                
                // Check multiple times to catch the track when it becomes available (skip immediate if already added)
                if (!subscribedUser || !subscribedUser.videoTrack) {
                    updateUserWithTrack(50);   // After 50ms
                }
                updateUserWithTrack(100); // After 100ms
                updateUserWithTrack(300); // After 300ms
                updateUserWithTrack(500); // After 500ms
                updateUserWithTrack(1000); // After 1 second
                updateUserWithTrack(2000); // After 2 seconds (fallback)
            }

            if (mediaType === "audio") {
                if (user.audioTrack) {
                    try {
                        const playResult = user.audioTrack.play();
                        // play() might return a promise or undefined
                        if (playResult && typeof playResult.catch === 'function') {
                            playResult.catch(err => {
                                console.error("Failed to play audio:", err);
                            });
                        }
                        console.log("🔊 Playing audio for user:", user.uid);
                    } catch (err) {
                        console.error("Error playing audio track:", err);
                    }
                } else {
                    console.warn("No audio track for user:", user.uid);
                }
            }
        } catch (error) {
            console.error("❌ Failed to subscribe to user", error);
            console.error("   Error details:", {
                uid: user.uid,
                mediaType,
                error: error.message,
                stack: error.stack
            });
        }
    };

    const handleUserUnpublished = (user, mediaType) => {
        console.log("User unpublished", user.uid, mediaType);
        if (mediaType === "video") {
            setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
        }
        // Audio track cleanup is handled automatically by Agora SDK
    };

    const handleUserLeft = (user) => {
        console.log("User left", user.uid);
        setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
    };

    // Set up event listeners before joining (as per Agora docs)
    const setupEventListeners = () => {
        const client = clientRef.current;
        if (!client) return;

        // Handle when a remote user publishes media
        client.on("user-published", handleUserPublished);
        
        // Handle when a remote user unpublishes media (stops publishing but doesn't leave)
        client.on("user-unpublished", handleUserUnpublished);
        
        // Handle when a remote user leaves the channel
        client.on("user-left", handleUserLeft);
        
        // Additional debugging events
        client.on("user-joined", (user) => {
            console.log("👤 User joined channel:", user.uid);
            console.log("   Channel:", channelName);
            console.log("   Has video:", user.hasVideo);
            console.log("   Has audio:", user.hasAudio);
        });
        
        client.on("user-published", (user, mediaType) => {
            console.log("📡 user-published event:", user.uid, mediaType);
            console.log("   User state:", {
                uid: user.uid,
                hasVideo: user.hasVideo,
                hasAudio: user.hasAudio,
                hasVideoTrack: !!user.videoTrack,
                hasAudioTrack: !!user.audioTrack
            });
        });
        
        // Listen for when remote user's video track becomes available
        client.on("stream-type-changed", (uid, streamType) => {
            console.log("🔄 Stream type changed for user:", uid, "Type:", streamType);
        });
        
        client.on("exception", (evt) => {
            console.error("⚠️ Agora exception:", evt);
            // Don't show audio level warnings as errors
            if (evt.code !== 4001) {
                console.error("   Exception code:", evt.code, "msg:", evt.msg);
            }
        });
        
        // Log connection state changes
        client.on("connection-state-change", (curState, revState) => {
            console.log("🔄 Connection state changed:", revState, "->", curState);
            setConnectionState(curState);
        });
    };

    // Initialize client (following Agora docs best practice)
    const initializeClient = () => {
        if (!clientRef.current) {
            clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            setupEventListeners();
        }
        return clientRef.current;
    };

    useEffect(() => {
        // Initialize client and set up listeners before joining
        const client = initializeClient();

        // Join automatically on mount
        joinChannel();

        // Monitor remote users for video tracks that become available
        const trackMonitor = setInterval(() => {
            if (client && client.remoteUsers) {
                client.remoteUsers.forEach(remoteUser => {
                    if (remoteUser.hasVideo && remoteUser.videoTrack) {
                        // Check if this user is in our list and has the track
                        setUsers(prevUsers => {
                            const existingUser = prevUsers.find(u => u.uid === remoteUser.uid);
                            if (existingUser) {
                                // Check if track is different (newly available or changed)
                                const existingTrackId = existingUser.videoTrack?.trackId;
                                const newTrackId = remoteUser.videoTrack?.trackId;
                                
                                if (!existingUser.videoTrack || existingTrackId !== newTrackId) {
                                    console.log("🔄 Video track became available/changed for user:", remoteUser.uid, {
                                        hadTrack: !!existingUser.videoTrack,
                                        oldTrackId: existingTrackId,
                                        newTrackId: newTrackId
                                    });
                                    setForceUpdate(prev => prev + 1); // Force re-render
                                    return prevUsers.map(u => 
                                        u.uid === remoteUser.uid ? { ...remoteUser } : u
                                    );
                                }
                            } else if (remoteUser.videoTrack) {
                                // User not in list but has video track - add them
                                console.log("➕ Adding user with video track to list:", remoteUser.uid, {
                                    trackId: remoteUser.videoTrack.trackId,
                                    enabled: remoteUser.videoTrack.enabled
                                });
                                setForceUpdate(prev => prev + 1); // Force re-render
                                return [...prevUsers, { ...remoteUser }];
                            }
                            return prevUsers;
                        });
                    }
                });
            }
        }, 500); // Check every 500ms (more frequent)

        return () => {
            clearInterval(trackMonitor);
            // Clean up event listeners
            if (client) {
                client.off("user-published", handleUserPublished);
                client.off("user-unpublished", handleUserUnpublished);
                client.off("user-left", handleUserLeft);
            }
            leaveChannel(true); // cleanup
        };
    }, []);

    const joinChannel = async () => {
        try {
            if (!appId) {
                const errorMsg = "Agora App ID is missing! Set VITE_AGORA_APP_ID in .env";
                setError(errorMsg);
                alert(errorMsg);
                return;
            }

            const client = clientRef.current;
            if (!client) {
                setError("Client not initialized");
                return;
            }

            // Fetch token from backend with retry logic
            setLoading(true);
            setError(null);
            let tokenData;
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    console.log(`🔑 Fetching Agora token for channel: ${channelName} (attempt ${retryCount + 1}/${maxRetries})`);
                    
                    tokenData = await fetchToken(channelName, null);
                    if (!tokenData || !tokenData.token) {
                        throw new Error("Token data is invalid or missing");
                    }
                    console.log("✅ Token fetched successfully, UID:", tokenData.uid);
                    setLoading(false);
                    setError(null);
                    break; // Success, exit retry loop
                } catch (tokenError) {
                    retryCount++;
                    console.error(`❌ Token fetch error (attempt ${retryCount}/${maxRetries}):`, tokenError);
                    
                    if (retryCount >= maxRetries) {
                        // Final attempt failed
                        const errorMsg = `Failed to get token after ${maxRetries} attempts: ${tokenError.message || 'Unknown error'}. Please ensure:\n1. Backend server is running\n2. AGORA_APP_CERTIFICATE is set in backend .env\n3. Network connection is stable`;
                        setError(errorMsg);
                        setLoading(false);
                        console.error("   Error details:", {
                            message: tokenError.message,
                            stack: tokenError.stack,
                            channelName
                        });
                        return;
                    } else {
                        // Wait before retry
                        console.log(`   Retrying in 1 second...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            // Join channel with the UID that matches the token
            // IMPORTANT: The UID used in join() must match the UID used to generate the token!
            console.log("🔌 Joining channel...");
            const uid = await client.join(appId, channelName, tokenData.token, tokenData.uid);
            console.log("✅ Joined channel successfully!");
            console.log("   Channel:", channelName);
            console.log("   UID:", uid);
            console.log("   App ID:", appId);
            
            // Wait a moment to ensure join is fully complete
            await new Promise(resolve => setTimeout(resolve, 100));

            // Create local audio and video tracks (following Agora docs)
            console.log("🎥 Creating local tracks...");
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks([audioTrack, videoTrack]);
            console.log("✅ Local tracks created");

            // Verify we're still in the channel before publishing
            if (client.connectionState !== 'CONNECTED' && client.connectionState !== 'CONNECTING') {
                throw new Error(`Cannot publish: Connection state is ${client.connectionState}. Must be CONNECTED or CONNECTING.`);
            }

            // Publish local tracks
            console.log("📤 Publishing local tracks...");
            await client.publish([audioTrack, videoTrack]);
            setStart(true);
            setError(null);
            console.log("✅ Published local tracks successfully!");
            console.log("   Local UID:", uid);
            console.log("   Channel:", channelName);
            console.log("   Connection state:", client.connectionState);
            
            // Check for existing remote users and subscribe to them
            const remoteUsers = client.remoteUsers;
            console.log("   Current remote users count:", remoteUsers.length);
            
            if (remoteUsers.length > 0) {
                console.log("   Found existing remote users, subscribing...");
                for (const remoteUser of remoteUsers) {
                    try {
                        // Subscribe to video if available
                        if (remoteUser.hasVideo) {
                            await clientRef.current.subscribe(remoteUser, "video");
                            console.log("   ✅ Subscribed to video for user:", remoteUser.uid);
                            
                            // Check immediately and after delays to catch track when it becomes available
                            const checkAndAddUser = (delay = 0) => {
                                setTimeout(() => {
                                    // Re-fetch user from remoteUsers to get latest track
                                    const updatedRemoteUser = clientRef.current.remoteUsers.find(u => u.uid === remoteUser.uid) || remoteUser;
                                    console.log(`   Remote user after subscribe (${delay}ms delay):`, {
                                        uid: updatedRemoteUser.uid,
                                        hasVideoTrack: !!updatedRemoteUser.videoTrack,
                                        trackId: updatedRemoteUser.videoTrack?.trackId,
                                        enabled: updatedRemoteUser.videoTrack?.enabled,
                                        muted: updatedRemoteUser.videoTrack?.muted,
                                        isPlaying: updatedRemoteUser.videoTrack?.isPlaying
                                    });
                                    
                                    // Only proceed if we have a video track
                                    if (updatedRemoteUser.videoTrack) {
                                        setUsers(prev => {
                                            const existingUser = prev.find(u => u.uid === updatedRemoteUser.uid);
                                            if (existingUser) {
                                                // Check if track is different
                                                if (existingUser.videoTrack?.trackId !== updatedRemoteUser.videoTrack?.trackId) {
                                                    console.log("   🔄 Updating existing remote user with NEW track:", updatedRemoteUser.uid);
                                                    const updated = prev.map(u => {
                                                        if (u.uid === updatedRemoteUser.uid) {
                                                            return { ...updatedRemoteUser };
                                                        }
                                                        return u;
                                                    });
                                                    setForceUpdate(prev => prev + 1); // Force re-render
                                                    return updated;
                                                } else {
                                                    console.log("   ✅ User already has this video track:", updatedRemoteUser.uid);
                                                    return prev;
                                                }
                                            }
                                            // Add new user
                                            console.log("   ➕ Adding existing remote user to list:", updatedRemoteUser.uid);
                                            setForceUpdate(prev => prev + 1); // Force re-render
                                            return [...prev, { ...updatedRemoteUser }];
                                        });
                                    } else {
                                        console.warn(`   ⚠️ Video track not available yet for existing user ${updatedRemoteUser.uid} (delay: ${delay}ms)`);
                                    }
                                }, delay);
                            };
                            
                            // Check immediately and after delays
                            checkAndAddUser(0);
                            checkAndAddUser(200);
                            checkAndAddUser(500);
                            checkAndAddUser(1000);
                            checkAndAddUser(2000);
                        }
                        
                        // Subscribe to audio if available
                        if (remoteUser.hasAudio) {
                            await clientRef.current.subscribe(remoteUser, "audio");
                            if (remoteUser.audioTrack) {
                                try {
                                    const playResult = remoteUser.audioTrack.play();
                                    // play() might return a promise or undefined
                                    if (playResult && typeof playResult.catch === 'function') {
                                        playResult.catch(err => {
                                            console.error("Failed to play audio:", err);
                                        });
                                    }
                                } catch (err) {
                                    console.error("Error playing audio track:", err);
                                }
                            }
                            console.log("   ✅ Subscribed to audio for user:", remoteUser.uid);
                        }
                    } catch (err) {
                        console.error("   ❌ Failed to subscribe to existing user:", remoteUser.uid, err);
                    }
                }
            } else {
                console.log("   Waiting for remote users to join...");
            }
        } catch (error) {
            console.error("Failed to join channel", error);
            setError(`Failed to join channel: ${error.message || error}`);
        }
    };

    const leaveChannel = async (isUnmount = false) => {
        try {
            const client = clientRef.current;
            
            // Stop and close local tracks (following Agora docs cleanup pattern)
            localTracks.forEach((track) => {
                if (track) {
                    track.stop();
                    track.close();
                }
            });
            setLocalTracks([]);
            setStart(false);

            // Leave the channel
            if (client) {
                await client.leave();
            }

            if (!isUnmount) navigate(-1); // Go back
        } catch (error) {
            console.error("Error leaving channel", error);
        }
    };

    const toggleTrack = async (type) => { // type: 'audio' or 'video'
        try {
            if (type === 'audio' && localTracks[0]) {
                await localTracks[0].setMuted(!trackState.audio);
                setTrackState(ps => ({ ...ps, audio: !ps.audio }));
            } else if (type === 'video' && localTracks[1]) {
                await localTracks[1].setMuted(!trackState.video);
                setTrackState(ps => ({ ...ps, video: !ps.video }));
            }
        } catch (error) {
            console.error(`Failed to toggle ${type}`, error);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-black">
            {/* Header - Minimal */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${start ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                        <h2 className="text-lg font-bold text-white">Video Consultation</h2>
                    </div>
                    {participantName !== 'Participant' && (
                        <div className="hidden md:block text-sm text-blue-100">
                            with <span className="font-semibold">{participantName}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-white text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span>{users.length + 1} {users.length === 0 ? 'Participant' : 'Participants'}</span>
                    </div>
                    <button
                        onClick={() => setShowDebug(!showDebug)}
                        className="text-white text-xs px-2 py-1 bg-black/30 rounded hover:bg-black/50"
                        title="Toggle Debug Info"
                    >
                        {showDebug ? 'Hide' : 'Show'} Debug
                    </button>
                </div>
            </div>

            {/* Loading Display */}
            {loading && !error && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 rounded-lg bg-blue-500/90 backdrop-blur-sm border border-blue-400 px-6 py-4 text-sm text-white shadow-2xl max-w-md">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <div>
                            <strong>Connecting...</strong> Fetching token...
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 rounded-lg bg-red-500/90 backdrop-blur-sm border border-red-400 px-6 py-4 text-sm text-white shadow-2xl max-w-md">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-xs">!</span>
                        </div>
                        <div>
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                </div>
            )}

            {/* Debug Panel */}
            {showDebug && (
                <div className="absolute top-20 right-4 z-50 rounded-lg bg-black/80 backdrop-blur-sm border border-white/20 px-4 py-3 text-xs text-white shadow-2xl max-w-xs">
                    <div className="space-y-2">
                        <div className="font-bold text-sm mb-2 border-b border-white/20 pb-2">Debug Info</div>
                        <div><strong>Channel:</strong> {channelName}</div>
                        <div><strong>Connection:</strong> {connectionState}</div>
                        <div><strong>Remote Users (State):</strong> {users.length}</div>
                        <div><strong>Remote Users (Agora):</strong> {clientRef.current?.remoteUsers?.length || 0}</div>
                        <div><strong>Local Published:</strong> {start ? 'Yes' : 'No'}</div>
                        {clientRef.current?.remoteUsers && clientRef.current.remoteUsers.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                                <div className="font-semibold">Agora Remote Users:</div>
                                {clientRef.current.remoteUsers.map(u => (
                                    <div key={u.uid} className="ml-2 text-xs">
                                        UID: {u.uid}, HasVideo: {u.hasVideo ? 'Yes' : 'No'}, 
                                        VideoTrack: {u.videoTrack ? `Yes (${u.videoTrack.trackId || 'no-id'})` : 'No'},
                                        HasAudio: {u.hasAudio ? 'Yes' : 'No'}
                                    </div>
                                ))}
                            </div>
                        )}
                        {users.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                                <div className="font-semibold">State Users:</div>
                                {users.map(u => (
                                    <div key={u.uid} className="ml-2 text-xs">
                                        UID: {u.uid}, Video: {u.videoTrack ? `Yes (${u.videoTrack.trackId || 'no-id'})` : 'No'}, Audio: {u.audioTrack ? 'Yes' : 'No'}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Video Area - Full Screen Style */}
            <div className="flex-1 relative bg-black overflow-hidden">
                {/* Remote Users - Main Large Display */}
                {users.length > 0 ? (
                    <div className="h-full w-full">
                        {users.length === 1 ? (
                            // Single remote user - Full screen
                            <div className="h-full w-full relative">
                                <VideoPlayer 
                                    key={`remote-${users[0].uid}-${forceUpdate}`}
                                    user={{
                                        ...users[0],
                                        displayName: participantName !== 'Participant' ? participantName : undefined
                                    }} 
                                    style="h-full w-full" 
                                />
                                {/* Participant Name Overlay */}
                                {participantName !== 'Participant' && (
                                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                                        <p className="text-white font-semibold text-lg">{participantName}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Multiple remote users - Grid layout
                            <div className={`grid h-full w-full gap-2 p-2 ${
                                users.length === 2 ? 'grid-cols-2' :
                                users.length === 3 ? 'grid-cols-2 grid-rows-2' :
                                users.length === 4 ? 'grid-cols-2 grid-rows-2' :
                                'grid-cols-3'
                            }`}>
                                {users.map((user, index) => (
                                    <div key={`container-${user.uid}`} className="relative">
                                        <VideoPlayer 
                                            key={`remote-${user.uid}-${forceUpdate}`}
                                            user={user} 
                                            style="h-full w-full" 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Waiting for other participants
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="mb-4">
                                <div className="inline-block animate-pulse">
                                    <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-xl font-semibold">Waiting for {participantName} to join...</p>
                            <p className="text-gray-400 mt-2">Your video will appear in the corner</p>
                        </div>
                    </div>
                )}

                {/* Local User - Picture in Picture (Small in corner) */}
                {start && localTracks[1] && (
                    <div className="absolute bottom-24 right-6 w-64 h-48 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border-2 border-white/20">
                        <VideoPlayer user={{ uid: 'You', videoTrack: localTracks[1] }} style="h-full w-full" />
                        
                        {/* Local User Label */}
                        <div className="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                            You
                        </div>

                        {/* Local Status Indicators */}
                        <div className="absolute bottom-2 right-2 flex gap-2">
                            {!trackState.audio && (
                                <div className="rounded-full bg-red-500 p-1.5 shadow-lg">
                                    <FiMicOff className="text-white text-xs" />
                                </div>
                            )}
                            {!trackState.video && (
                                <div className="rounded-full bg-red-500 p-1.5 shadow-lg">
                                    <FiVideoOff className="text-white text-xs" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Connection Status Overlay */}
                {!start && !error && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center text-white">
                            <div className="mb-4">
                                <div className="inline-block animate-spin">
                                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-xl font-semibold">Connecting...</p>
                            <p className="text-gray-400 mt-2">Please wait</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Bar - Modern Design */}
            <div className="flex items-center justify-center gap-4 bg-gray-900/95 backdrop-blur-lg py-4 px-6 border-t border-white/10">
                <button
                    onClick={() => toggleTrack('audio')}
                    className={`rounded-full p-4 transition-all duration-200 ${
                        trackState.audio 
                            ? 'bg-white/10 hover:bg-white/20 text-white' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                    }`}
                    title={trackState.audio ? 'Mute' : 'Unmute'}
                >
                    {trackState.audio ? <FiMic size={22} /> : <FiMicOff size={22} />}
                </button>

                <button
                    onClick={() => toggleTrack('video')}
                    className={`rounded-full p-4 transition-all duration-200 ${
                        trackState.video 
                            ? 'bg-white/10 hover:bg-white/20 text-white' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                    }`}
                    title={trackState.video ? 'Turn off camera' : 'Turn on camera'}
                >
                    {trackState.video ? <FiVideo size={22} /> : <FiVideoOff size={22} />}
                </button>

                <div className="w-px h-8 bg-white/20 mx-2"></div>

                <button
                    onClick={() => leaveChannel()}
                    className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white shadow-xl transition-all hover:bg-red-600 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <FiPhoneOff size={20} />
                    <span className="hidden sm:inline">End Call</span>
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
