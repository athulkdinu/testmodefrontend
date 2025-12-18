import SERVERURL from '../services/serverURL';

export const appId = import.meta.env.VITE_AGORA_APP_ID || "";
export const channelName = "mainRoom";

// Function to fetch token from backend
export const fetchToken = async (channel = channelName, uid = null) => {
    try {
        // Construct URL properly
        const baseUrl = SERVERURL.endsWith('/') ? SERVERURL.slice(0, -1) : SERVERURL;
        const tokenUrl = `${baseUrl}/api/agora/token`;
        const url = new URL(tokenUrl);
        url.searchParams.append('channelName', channel);
        if (uid !== null) {
            url.searchParams.append('uid', uid);
        }

        console.log('🔑 Fetching token from:', url.toString());
        console.log('   Base URL:', SERVERURL);
        console.log('   Channel:', channel);
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // Add timeout
            signal: AbortSignal.timeout(10000) // 10 second timeout
        }).catch(fetchError => {
            // Handle network errors
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout: Backend server is not responding. Please check if the server is running.');
            } else if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
                throw new Error(`Cannot connect to backend server at ${SERVERURL}. Please check:\n1. Backend server is running\n2. Server URL is correct\n3. CORS is configured properly`);
            }
            throw fetchError;
        });

        // Check if response is ok
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                // Response is not JSON
                const text = await response.text().catch(() => 'No response body');
                errorData = { 
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    details: text.substring(0, 200) // First 200 chars
                };
            }
            
            const errorMsg = errorData.error || errorData.message || 'Failed to fetch token';
            let details = '';
            
            if (errorData.details) {
                details = ` Details: ${errorData.details}`;
            } else if (errorData.envCheck) {
                // Show environment check info
                details = `\nEnvironment Check:\n- Has App ID: ${errorData.envCheck.hasAppId}\n- Has Certificate: ${errorData.envCheck.hasCertificate}`;
            }
            
            throw new Error(`${errorMsg}${details}`);
        }

        const data = await response.json();
        
        if (!data || !data.token) {
            throw new Error('Invalid token response from server. Response: ' + JSON.stringify(data).substring(0, 100));
        }

        console.log('✅ Token received successfully');
        console.log('   Token length:', data.token?.length);
        console.log('   UID:', data.uid);
        
        // Return both token and uid - they must match!
        return {
            token: data.token,
            uid: data.uid
        };
    } catch (error) {
        console.error('❌ Error fetching Agora token:', error);
        console.error('   Server URL:', SERVERURL);
        console.error('   Channel:', channel);
        console.error('   Error type:', error.name);
        console.error('   Error message:', error.message);
        
        // Re-throw with more context
        if (error.message) {
            throw error;
        } else {
            throw new Error(`Network error: ${error.message || 'Failed to connect to server'}`);
        }
    }
};
