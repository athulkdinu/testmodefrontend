import axios from "axios";

// Normalize axios response so the rest of the app (written for fetch)
// can continue using `.status` and `.json()`.
const normalizeResponse = (resp) => ({
    status: resp?.status ?? 0,
    data: resp?.data,
    headers: resp?.headers,
    json: async () => resp?.data
});

// Shared axios wrapper used by all service functions
export const commonAPI = async (httprequest, url, reqbody, reqheader) => {
    const requestconfig = {
        method: httprequest,
        url,
        data: reqbody,
        headers: reqheader ? { "Content-Type": "application/json", ...reqheader } : { "Content-Type": "application/json" }
    };

    return await axios(requestconfig)
        .then(res => normalizeResponse(res)) // success response
        .catch(err => {
            // err.response is undefined for network/timeout/CORS errors
            console.log("API ERROR:", err.response || err.message);
            const fallback = err.response || { status: 0, data: { message: err.message } };
            return normalizeResponse(fallback);
        });
};
