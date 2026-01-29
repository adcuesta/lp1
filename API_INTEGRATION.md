# API Integration Documentation

## Overview
This OTP Landing Page fetches its configuration dynamically from the backend API, allowing for customizable landing pages based on domain.

## API Endpoint

**URL:** `https://kidoz.xyz/api/lp/resolve-lp-domain/`  
**Method:** `GET`  
**Query Parameters:** 
- `domain` (required) - The domain to resolve configuration for (e.g., `oman.kidoz.xyz`)

**Full Example:**
```
https://kidoz.xyz/api/lp/resolve-lp-domain/?domain=oman.kidoz.xyz
```

## API Response Format

```json
{
  "landing_page": {
    "id": 1,
    "name": "lp1",
    "description": "",
    "default_url": "http://lp1.kidozz.xyz",
    "default_footer": "",
    "default_language": "en",
    "default_bg_color": "#12E893",
    "default_submit_button_text": "Submit",
    "is_active": true,
    "created_at": "2026-01-29T11:03:27.489503+05:30"
  },
  "campaign": {
    "id": 22,
    "service_id": 37,
    "publisher_id": 13,
    "created_at": "2025-09-04T19:14:13.202000+05:30",
    "is_active": true
  }
}
```

## Configuration Mapping

The API response is automatically mapped to the frontend configuration:

| API Field | Frontend Config | Description |
|-----------|----------------|-------------|
| `landing_page.default_bg_color` | `primaryColor` | Main background/brand color |
| `landing_page.default_language` | `language` | UI language (en/ar) |
| `landing_page.default_footer` | `footerText` | Footer disclaimer text |
| `landing_page.default_submit_button_text` | `translations.buttonText` | Submit button label |
| `landing_page.is_active` | - | If false, uses default config |
| `landing_page.id` | `landingPageId` | Stored for tracking |
| `campaign.id` | `campaignId` | Stored for tracking |
| `campaign.service_id` | `serviceId` | Stored for tracking |
| `campaign.publisher_id` | `publisherId` | Stored for tracking |

## How It Works

1. **Domain Detection**: The app automatically detects the current domain from the request headers
2. **API Request**: Makes a GET request to the API with the detected domain
3. **Data Mapping**: Transforms the API response into the format expected by React components
4. **Fallback**: If the API fails or returns inactive landing page, uses default configuration
5. **Rendering**: Components receive the config and render accordingly

## Implementation Files

- **`src/lib/config.js`** - Contains the API integration logic
  - `getBackendConfig()` - Main function that fetches and processes config
  - `getCurrentDomain()` - Extracts domain from headers
  - `mapApiResponseToConfig()` - Maps API response to frontend format
  - `getDefaultConfig()` - Provides fallback configuration

- **`src/app/page.js`** - Main page that uses the config
  - Fetches headers and passes to `getBackendConfig()`
  - Applies configuration to UI elements

## Testing the Integration

### Local Testing
When running locally, the domain will default to `oman.kidoz.xyz`. To test with a different domain:

1. Modify the fallback in `getCurrentDomain()` function in `src/lib/config.js`
2. Or deploy to a custom domain

### Verify API Call
Check the browser console or server logs for:
```
Fetching config from: https://kidoz.xyz/api/lp/resolve-lp-domain/?domain=YOUR_DOMAIN
Config loaded successfully: { ... }
```

### Test Error Handling
To test the fallback mechanism:
1. Temporarily modify the API URL to an invalid endpoint
2. The app should display with default configuration
3. Check console for error message: `Error fetching backend config`

## Configuration Properties

The final config object passed to components includes:

```javascript
{
  // Visual styling
  primaryColor: "#12E893",      // From API: default_bg_color
  secondaryColor: "#ffffff",    // Hardcoded
  accentColor: "#f87171",       // Hardcoded
  
  // Localization
  language: "en",               // From API: default_language
  
  // Content
  footerText: "Terms...",       // From API: default_footer
  
  // Country codes for phone input
  countryCodes: [...],          // Hardcoded list
  
  // UI translations
  translations: {
    title: "Your file is ready",
    subtitle: "Enter your phone number...",
    inputPlaceholder: "Mobile number",
    buttonText: "Submit",       // From API: default_submit_button_text
    errorMessage: "Please insert..."
  },
  
  // Language options
  availableLanguages: [
    { code: "ar", label: "AR" },
    { code: "en", label: "EN" }
  ],
  
  // Tracking data from API
  landingPageId: 1,
  landingPageName: "lp1",
  campaignId: 22,
  serviceId: 37,
  publisherId: 13
}
```

## Future Enhancements

1. **Dynamic Country Codes**: Fetch country codes from API instead of hardcoding
2. **Full Translations**: Support complete language packs from API
3. **Caching**: Implement smart caching strategy for better performance
4. **A/B Testing**: Support for multiple landing page variants

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Falls back to default config
- **Invalid Response**: Falls back to default config
- **Inactive Landing Page**: Falls back to default config
- **Missing Fields**: Uses sensible defaults for any missing values

All errors are logged to the console for debugging.

## Notes

- The API request uses `cache: 'no-store'` to always fetch fresh data
- Domain detection works automatically in production
- All API data (campaign, service IDs) is stored in config for future use
- The integration is server-side for better SEO and performance
