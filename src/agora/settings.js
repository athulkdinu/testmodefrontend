import SERVERURL from '../services/serverURL';

export const appId = import.meta.env.VITE_AGORA_APP_ID || "";
export const channelName = "mainRoom";

// Function to fetch token from backend
export const fetchToken = async (channel = channelName, uid = null) => {
    try {
        const url = new URL(`${SERVERURL}/api/agora/token`);
        url.searchParams.append('channelName', channel);
        if (uid !== null) {
            url.searchParams.append('uid', uid);
        }

        console.log('🔑 Fetching token from:', url.toString());
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if response is ok
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
            }
            const errorMsg = errorData.error || errorData.message || 'Failed to fetch token';
            const details = errorData.details ? ` Details: ${errorData.details}` : '';
            throw new Error(`${errorMsg}${details}`);
        }

        const data = await response.json();
        
        if (!data || !data.token) {
            throw new Error('Invalid token response from server');
        }

        console.log('✅ Token received successfully');
        
        // Return both token and uid - they must match!
        return {
            token: data.token,
            uid: data.uid
        };
    } catch (error) {
        console.error('❌ Error fetching Agora token:', error);
        console.error('   Server URL:', SERVERURL);
        console.error('   Channel:', channel);
        // Re-throw with more context
        if (error.message) {
            throw error;
        } else {
            throw new Error(`Network error: ${error.message || 'Failed to connect to server'}`);
        }
    }
};
