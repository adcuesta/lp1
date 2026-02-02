# API Documentation

## Expected API Response

Your backend API should return a JSON object with the following structure:

### Endpoint
```
GET /api/config
```

### Response Format

```json
{
  "primaryColor": "#00C2E0",
  "secondaryColor": "#ffffff",
  "accentColor": "#f87171",
  "language": "en",
  "footerText": "Footer text in the selected language...",
  
  "countryCodes": [
    {
      "code": "+971",
      "country": "UAE",
      "flag": "🇦🇪"
    },
    {
      "code": "+966",
      "country": "Saudi Arabia",
      "flag": "🇸🇦"
    }
  ],
  
  "translations": {
    "title": "Your file is ready",
    "subtitle": "Enter your phone number and confirm the PIN code",
    "inputPlaceholder": "Mobile number",
    "buttonText": "CONTINUE",
    "errorMessage": "Please insert your phone number"
  },
  //minor changes
  "availableLanguages": [
    {
      "code": "ar",
      "label": "AR"
    },
    {
      "code": "en",
      "label": "EN"
    }
  ]
}
```

## Translation System

### How It Works

1. **Language Detection**: The `language` field in the API response determines the current language
2. **Content Translation**: All text content comes from the `translations` object
3. **RTL Support**: When `language === "ar"`, the entire layout automatically switches to RTL (Right-to-Left)
4. **Dynamic Country Names**: Country codes dropdown shows names in the selected language

### Example: English Response

```json
{
  "language": "en",
  "translations": {
    "title": "Your file is ready",
    "subtitle": "Enter your phone number and confirm the PIN code",
    "inputPlaceholder": "Mobile number",
    "buttonText": "CONTINUE",
    "errorMessage": "Please insert your phone number"
  },
  "countryCodes": [
    { "code": "+971", "country": "UAE", "flag": "🇦🇪" }
  ]
}
```

### Example: Arabic Response

```json
{
  "language": "ar",
  "translations": {
    "title": "ملفك جاهز",
    "subtitle": "أدخل رقم هاتفك وقم بتأكيد رمز PIN",
    "inputPlaceholder": "رقم الجوال",
    "buttonText": "متابعة",
    "errorMessage": "الرجاء إدخال رقم هاتفك"
  },
  "countryCodes": [
    { "code": "+971", "country": "الإمارات", "flag": "🇦🇪" }
  ]
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primaryColor` | String | Yes | Main brand color in hex format (e.g., "#00C2E0") |
| `secondaryColor` | String | Yes | Secondary color for backgrounds |
| `accentColor` | String | Yes | Accent color for errors/highlights |
| `language` | String | Yes | Current language code ("en", "ar", etc.) |
| `footerText` | String | Yes | Footer text in the selected language |
| `countryCodes` | Array | Yes | List of supported country codes with flags |
| `translations` | Object | Yes | All UI text in the selected language |
| `availableLanguages` | Array | Yes | Supported languages for the toggle |

### Country Code Object

```json
{
  "code": "+971",      // Country dialing code
  "country": "UAE",    // Country name (translated)
  "flag": "🇦🇪"        // Country flag emoji
}
```

### Translations Object

All translation keys are **required**:

- `title` - Main heading text
- `subtitle` - Instruction text below the icon
- `inputPlaceholder` - Phone input placeholder
- `buttonText` - Submit button text
- `errorMessage` - Error message for invalid input

### Available Languages Object

```json
{
  "code": "en",   // Language code
  "label": "EN"   // Display label for toggle button
}
```

## Testing Different Languages

To test the Arabic version, modify `src/lib/config.js`:

```javascript
export const getBackendConfig = async () => {
  // For testing Arabic:
  return {
    language: "ar",
    translations: {
      title: "ملفك جاهز",
      subtitle: "أدخل رقم هاتفك وقم بتأكيد رمز PIN",
      inputPlaceholder: "رقم الجوال",
      buttonText: "متابعة",
      errorMessage: "الرجاء إدخال رقم هاتفك"
    },
    // ... rest of config
  };
};
```

## Integration Steps

1. **Replace the mock function** in `src/lib/config.js` with your actual API call:

```javascript
export const getBackendConfig = async () => {
  const response = await fetch('YOUR_API_ENDPOINT/config');
  return await response.json();
};
```

2. **Handle language switching**: When users click the language toggle, make a new API request with the selected language parameter:

```javascript
GET /api/config?lang=ar
```

3. **Error Handling**: Add proper error handling for API failures with fallback to default English content

## Supported Country Codes

The system supports any country code. Common ones for the region:

- 🇦🇪 UAE: +971
- 🇸🇦 Saudi Arabia: +966
- 🇰🇼 Kuwait: +965
- 🇧🇭 Bahrain: +973
- 🇶🇦 Qatar: +974
- 🇴🇲 Oman: +968
- 🇪🇬 Egypt: +20
- 🇯🇴 Jordan: +962

## Notes

- The layout automatically switches between LTR and RTL based on the `language` field
- Footer appears only when user scrolls the page
- All colors are customizable via the API response
- Country code dropdown is fully searchable and scrollable
