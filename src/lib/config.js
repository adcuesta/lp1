/**
 * API Response Structure from backend:
 * 
 * {
 *   "landing_page": {
 *     "id": 1,
 *     "name": "lp1",
 *     "description": "",
 *     "default_url": "http://lp1.kidozz.xyz",
 *     "default_footer": "",
 *     "default_language": "en",
 *     "default_bg_color": "#12E893",
 *     "default_submit_button_text": "Submit",
 *     "is_active": true,
 *     "created_at": "2026-01-29T11:03:27.489503+05:30"
 *   },
 *   "campaign": {
 *     "id": 22,
 *     "service_id": 37,
 *     "publisher_id": 13,
 *     "created_at": "2025-09-04T19:14:13.202000+05:30",
 *     "is_active": true
 *   }
 * }
 */

// Default fallback configuration
const getDefaultConfig = () => ({
  primaryColor: "#00C2E0", 
  secondaryColor: "#ffffff",
  accentColor: "#f87171",
  backgroundColor: "#EAF8F9",
  language: "en",
  footerText: "By subscribing to the service, you agree to the following terms and conditions: A standard subscription fee applies. To unsubscribe, send 'STOP' to 1234.",
  
  countryCodes: [
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
  ],
  
  translations: {
    title: "Your file is ready",
    subtitle: "Enter your phone number and confirm the PIN code",
    inputPlaceholder: "Mobile number",
    buttonText: "CONTINUE",
    errorMessage: "Please insert your phone number"
  },
  
  availableLanguages: [
    { code: "ar", label: "AR" },
    { code: "en", label: "EN" }
  ],
  
  // API data
  landingPageId: null,
  campaignId: null,
  serviceId: null,
  publisherId: null,
});

// Get current domain from request headers
const getCurrentDomain = (headers) => {
  // Check for environment variable override first (useful for development)
  if (process.env.NEXT_PUBLIC_OVERRIDE_DOMAIN) {
    return process.env.NEXT_PUBLIC_OVERRIDE_DOMAIN;
  }
  
  const host = headers?.get('host') || headers?.host;
  return host || 'oman.kidoz.xyz'; // Default fallback
};

// Map API response to frontend config format
const mapApiResponseToConfig = (apiData) => {
  const { landing_page, campaign } = apiData;
  
  return {
    // Map landing page colors and settings
    primaryColor: landing_page?.default_bg_color || "#00C2E0",
    secondaryColor: "#ffffff",
    accentColor: "#f87171",
    backgroundColor: "#EAF8F9",
    language: landing_page?.default_language || "en",
    footerText: landing_page?.default_footer || "By subscribing to the service, you agree to the following terms and conditions.",
    
    // Country codes (hardcoded for now, can be made dynamic later)
    countryCodes: [
      { code: "+971", country: "UAE", flag: "🇦🇪" },
      { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
      { code: "+965", country: "Kuwait", flag: "🇰🇼" },
      { code: "+973", country: "Bahrain", flag: "🇧🇭" },
      { code: "+974", country: "Qatar", flag: "🇶🇦" },
      { code: "+968", country: "Oman", flag: "🇴🇲" },
      { code: "+20", country: "Egypt", flag: "🇪🇬" },
      { code: "+962", country: "Jordan", flag: "🇯🇴" },
    ],
    
    // Translations based on language
    translations: {
      title: "Your file is ready",
      subtitle: "Enter your phone number and confirm the PIN code",
      inputPlaceholder: "Mobile number",
      buttonText: landing_page?.default_submit_button_text || "CONTINUE",
      errorMessage: "Please insert your phone number"
    },
    
    availableLanguages: [
      { code: "ar", label: "AR" },
      { code: "en", label: "EN" }
    ],
    
    // Store API data for later use
    landingPageId: landing_page?.id,
    landingPageName: landing_page?.name,
    campaignId: campaign?.id,
    serviceId: campaign?.service_id,
    publisherId: campaign?.publisher_id,
    domain: null, // Will be set by getBackendConfig
  };
};

// Fetch configuration from API
export const getBackendConfig = async (headers = null) => {
  try {
    // Get the current domain
    const domain = getCurrentDomain(headers);
    
    // Construct API URL
    const apiUrl = `https://kidoz.xyz/api/lp/resolve-lp-domain/?domain=${encodeURIComponent(domain)}`;
    
    console.log(`Fetching config from: ${apiUrl}`);
    
    // Make API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching to always get fresh data
    });
    
    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}. Using default config.`);
      return getDefaultConfig();
    }
    
    const apiData = await response.json();
    
    // Check if landing page is active
    if (!apiData.landing_page?.is_active) {
      console.warn('Landing page is not active, using default config');
      return getDefaultConfig();
    }
    
    // Map and return the configuration
    const config = mapApiResponseToConfig(apiData);
    
    // Add the domain to the config for frontend use
    config.domain = domain;
    
    console.log('Config loaded successfully:', config);
    
    return config;
    
  } catch (error) {
    console.error('Error fetching backend config:', error);
    console.log('Falling back to default configuration');
    
    // Return default config on error
    return getDefaultConfig();
  }
};
