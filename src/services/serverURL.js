
// Automatically detect environment and use appropriate backend URL
const getServerURL = () => {
  // Check if we're in production (deployed on Vercel or other hosting)
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  // Use environment variable if available, otherwise auto-detect
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) {
    return envURL;
  }
  
  // Auto-detect: use remote backend in production, localhost in development
  return isProduction 
    ? "https://testmodebackend.onrender.com"
    : "http://localhost:3000";
};

const SERVERURL = getServerURL();
export default SERVERURL;
