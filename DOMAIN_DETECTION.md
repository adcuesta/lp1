# Dynamic Domain Detection System

## Overview

The system automatically detects the current domain and fetches configuration from the API based on that domain. This allows the same codebase to serve different landing pages with different configurations based on the domain being accessed.

## How It Works

### 1. Domain Detection Flow

```
User visits domain → Next.js page loads → Headers passed to config → Domain extracted → API called with domain → Config returned → Page rendered
```

### 2. Domain Detection Logic

The `getCurrentDomain(headers)` function in `src/lib/config.js` detects the domain in this priority order:

1. **Environment Variable Override** (for testing)
   - Check: `process.env.NEXT_PUBLIC_OVERRIDE_DOMAIN`
   - Use case: Local development and testing
   
2. **Client-Side Detection** 
   - Check: `window.location.hostname`
   - Use case: When code runs in the browser
   
3. **Server-Side Detection**
   - Check: Request headers (`host` header)
   - Use case: Initial page load (Next.js server-side rendering)

### 3. API Integration

**Endpoint:**
```
GET https://kidoz.xyz/api/lp/resolve-lp-domain/?domain={detected_domain}
```

**Example Request:**
```
GET https://kidoz.xyz/api/lp/resolve-lp-domain/?domain=oman.kidoz.xyz
```

**Expected Response:**
```json
{
  "landing_page": {
    "id": 1,
    "domain_name": "otplanding.netlify.app",
    "domain_url": "http://oman.kidoz.xyz",
    "country_code": "968",
    "country_name": "Oman",
    "footer_text": "Footer text here",
    "bg_color": "#000000",
    "submit_button_text": "Continue",
    "language": "en",
    "redirect_url": "https://kidzoo.gotclick.site/",
    "is_active": true,
    "created_at": "2026-01-29T11:05:19.595853+05:30",
    "landing_page": 1,
    "campaign": 22
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

## What Gets Dynamically Applied

Based on the API response, the following are dynamically configured:

### Visual Styling
- ✅ **Background Color**: `landing_page.bg_color` → Applied to page background
- ✅ **Primary Color**: `landing_page.bg_color` → Applied to buttons and accents

### Content
- ✅ **Submit Button Text**: `landing_page.submit_button_text`
- ✅ **Footer Text**: `landing_page.footer_text`
- ✅ **Language**: `landing_page.language` (en/ar with RTL support)

### Country Configuration
- ✅ **Default Country Code**: Extracted from `landing_page.country_code`
- ✅ **Country Name**: From `landing_page.country_name`

### Metadata
- ✅ **Campaign ID**: `campaign.id`
- ✅ **Service ID**: `campaign.service_id`
- ✅ **Publisher ID**: `campaign.publisher_id`
- ✅ **Redirect URL**: `landing_page.redirect_url`

## Testing Different Domains

### Method 1: Environment Variable Override (Development)

Add to `.env.local`:
```env
NEXT_PUBLIC_OVERRIDE_DOMAIN=oman.kidoz.xyz
```

This will force the system to always use this domain, regardless of the actual URL.

### Method 2: Edit hosts file (Testing)

1. Edit your hosts file:
   - Windows: `C:\Windows\System32\drivers\etc\hosts`
   - Mac/Linux: `/etc/hosts`

2. Add entries:
```
127.0.0.1 oman.kidoz.xyz
127.0.0.1 uae.kidoz.xyz
127.0.0.1 saudi.kidoz.xyz
```

3. Access via: `http://oman.kidoz.xyz:3000`

### Method 3: Deploy to Different Domains

Deploy the same codebase to multiple domains:
- `otplanding.netlify.app` → Gets Oman config
- `uaelanding.netlify.app` → Gets UAE config
- Each domain automatically gets its own configuration

## Console Logging

The system provides detailed console logs to help debug:

```
==========================================
🌐 Dynamic Domain Detection
Detected Domain: oman.kidoz.xyz
API URL: https://kidoz.xyz/api/lp/resolve-lp-domain/?domain=oman.kidoz.xyz
==========================================
✅ API Response received: {...}
✅ Config mapped successfully
  - Background Color: #000000
  - Button Text: Continue
  - Country Code: +968
  - Language: en
  - Redirect URL: https://kidzoo.gotclick.site/
==========================================
```

## Error Handling

If the API fails or returns invalid data:

1. **API Request Fails**: Falls back to default configuration
2. **Landing Page Inactive**: (`is_active: false`) Falls back to default
3. **Network Error**: Falls back to default configuration

Default configuration is defined in `getDefaultConfig()` in `src/lib/config.js`.

## Example Scenarios

### Scenario 1: Oman Domain
**Domain:** `oman.kidoz.xyz`  
**Result:** 
- Background: Black (#000000)
- Country: +968 (Oman)
- Button: "Continue"
- Language: English

### Scenario 2: UAE Domain
**Domain:** `uae.kidoz.xyz`  
**Result:** 
- Gets UAE-specific configuration from API
- Different colors, country code, content

### Scenario 3: Local Development
**Domain:** `localhost:3000`  
**Result:** 
- Sends "localhost" to API
- API returns appropriate config or error
- Falls back to default if no match

## Troubleshooting

### Problem: Always seeing default config
**Check:**
1. Open browser console and look for domain detection logs
2. Verify API endpoint is reachable
3. Check if `is_active` is true in API response
4. Verify domain exists in backend database

### Problem: Wrong domain detected
**Check:**
1. Console logs for "Detected Domain"
2. Verify headers are being passed correctly
3. Check if environment override is set

### Problem: Styles not applying
**Check:**
1. Verify API response has correct field names
2. Check browser console for config mapping logs
3. Verify background color is valid hex code
