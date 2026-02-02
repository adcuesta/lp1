/**
 * API Response Structure from backend:
 * 
 * {
 *   "landing_page": {
 *     "id": 1,
 *     "domain_name": "otplanding.netlify.app",
 *     "domain_url": "http://oman.kidoz.xyz",
 *     "country_code": "968",
 *     "country_name": "Oman",
 *     "footer_text": "Footer text here",
 *     "bg_color": "#000000",
 *     "submit_button_text": "Continue",
 *     "language": "en",
 *     "redirect_url": "https://kidzoo.gotclick.site/",
 *     "is_active": true,
 *     "created_at": "2026-01-29T11:05:19.595853+05:30",
 *     "landing_page": 1,
 *     "campaign": 22
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

// Get current domain dynamically
const getCurrentDomain = (headers) => {
  // Check for environment variable override first (useful for development/testing)
  if (process.env.NEXT_PUBLIC_OVERRIDE_DOMAIN) {
    console.log('Using override domain:', process.env.NEXT_PUBLIC_OVERRIDE_DOMAIN);
    return process.env.NEXT_PUBLIC_OVERRIDE_DOMAIN;
  }

  // Client-side: Use window.location.hostname
  if (typeof window !== 'undefined') {
    const domain = window.location.hostname;
    console.log('Client-side domain detected:', domain);
    return domain;
  }

  // Server-side: Use request headers
  const host = headers?.get('host') || headers?.host;
  const domain = host || 'localhost'; // Default fallback
  console.log('Server-side domain detected:', domain);
  return domain;
};

// Helper function to get country details from country code
const getCountryDetails = (countryCode) => {
  const countryMap = {
    "971": { code: "+971", country: "UAE", flag: "🇦🇪" },
    "966": { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    "965": { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    "973": { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    "974": { code: "+974", country: "Qatar", flag: "🇶🇦" },
    "968": { code: "+968", country: "Oman", flag: "🇴🇲" },
    "20": { code: "+20", country: "Egypt", flag: "🇪🇬" },
    "962": { code: "+962", country: "Jordan", flag: "🇯🇴" },
  };
  
  return countryMap[countryCode] || { code: `+${countryCode}`, country: "Unknown", flag: "🌍" };
};

// Map API response to frontend config format
const mapApiResponseToConfig = (apiData) => {
  const { landing_page, campaign } = apiData;

  // Get the country details from the country_code in the response
  const countryDetails = getCountryDetails(landing_page?.country_code);

  return {
    // Map landing page colors and settings
    primaryColor: landing_page?.bg_color || "#00C2E0",
    secondaryColor: "#ffffff",
    accentColor: "#f87171",
    backgroundColor: landing_page?.bg_color || "#EAF8F9",
    language: landing_page?.language || "en",
    footerText: landing_page?.footer_text ? landing_page.footer_text.replace(/\\n/g, '\n') : "By subscribing to the service, you agree to the following terms and conditions.",

    // Country codes - prioritize the country from API, then add others
    countryCodes: [
      countryDetails,
      { code: "+971", country: "UAE", flag: "🇦🇪" },
      { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
      { code: "+965", country: "Kuwait", flag: "🇰🇼" },
      { code: "+973", country: "Bahrain", flag: "🇧🇭" },
      { code: "+974", country: "Qatar", flag: "🇶🇦" },
      { code: "+968", country: "Oman", flag: "🇴🇲" },
      { code: "+20", country: "Egypt", flag: "🇪🇬" },
      { code: "+962", country: "Jordan", flag: "🇯🇴" },
    ].filter((country, index, self) => 
      // Remove duplicates based on country code
      index === self.findIndex((c) => c.code === country.code)
    ),

    // Translations based on language
    translations: {
      title: "Your file is ready",
      subtitle: "Enter your phone number and confirm the PIN code",
      inputPlaceholder: "Mobile number",
      buttonText: landing_page?.submit_button_text || "CONTINUE",
      errorMessage: "Please insert your phone number"
    },

    availableLanguages: [
      { code: "ar", label: "AR" },
      { code: "en", label: "EN" }
    ],

    // Store API data for later use
    landingPageId: landing_page?.id,
    landingPageName: landing_page?.domain_name,
    campaignId: campaign?.id,
    serviceId: campaign?.service_id,
    publisherId: campaign?.publisher_id,
    redirectUrl: landing_page?.redirect_url,
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

    console.log('==========================================');
    console.log('🌐 Dynamic Domain Detection');
    console.log('Detected Domain:', domain);
    console.log('API URL:', apiUrl);
    console.log('==========================================');

    // Make API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching to always get fresh data
    });

    if (!response.ok) {
      console.warn(`❌ API request failed with status ${response.status}. Using default config.`);
      return getDefaultConfig();
    }

    const apiData = await response.json();
    console.log('✅ API Response received:', JSON.stringify(apiData, null, 2));

    // Check if landing page is active
    if (!apiData.landing_page?.is_active) {
      console.warn('⚠️ Landing page is not active, using default config');
      return getDefaultConfig();
    }

    // Map and return the configuration
    const config = mapApiResponseToConfig(apiData);

    // Add the domain to the config for frontend use
    config.domain = domain;

    console.log('✅ Config mapped successfully');
    console.log('  - Background Color:', config.backgroundColor);
    console.log('  - Button Text:', config.translations.buttonText);
    console.log('  - Country Code:', config.countryCodes[0].code);
    console.log('  - Language:', config.language);
    console.log('  - Redirect URL:', config.redirectUrl);
    console.log('==========================================');

    return config;

  } catch (error) {
    console.error('❌ Error fetching backend config:', error);
    console.log('Falling back to default configuration');

    // Return default config on error
    return getDefaultConfig();
  }
};
