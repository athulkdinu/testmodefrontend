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

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error || data.message || 'Failed to fetch token';
            const details = data.details ? ` Details: ${data.details}` : '';
            throw new Error(`${errorMsg}${details}`);
        }

        // Return both token and uid - they must match!
        return {
            token: data.token,
            uid: data.uid
        };
    } catch (error) {
        console.error('Error fetching Agora token:', error);
        throw error;
    }
};
