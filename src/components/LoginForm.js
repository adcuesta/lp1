"use client";

import { useState } from "react";
import { Smartphone, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to get default country based on domain or first in list
const getDefaultCountry = (config) => {
    if (!config.countryCodes || config.countryCodes.length === 0) {
        return { code: "+971", country: "UAE", flag: "🇦🇪" };
    }

    // If we have a domain, try to match it to a country
    if (config.domain) {
        const domainLower = config.domain.toLowerCase();

        // Map landing page names/domains to country codes
        const countryMapping = {
            'oman': '+968',
            'uae': '+971',
            'saudi': '+966',
            'kuwait': '+965',
            'bahrain': '+973',
            'qatar': '+974',
            'egypt': '+20',
            'jordan': '+962'
        };

        // Check if domain contains any country identifier
        for (const [countryKey, countryCode] of Object.entries(countryMapping)) {
            if (domainLower.includes(countryKey)) {
                const matchedCountry = config.countryCodes.find(c => c.code === countryCode);
                if (matchedCountry) {
                    return matchedCountry;
                }
            }
        }
    }

    // Default to first country in the list
    return config.countryCodes[0];
};

export default function LoginForm({ config }) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry(config));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        setPhoneNumber(value);

        // Simple validation (10 digits for UAE mobile)
        if (value.length >= 9) {
            setIsValid(true);
            setError("");
        } else {
            setIsValid(false);
        }
    };

    const handleSubmit = () => {
        if (!isValid) {
            setError(config.translations?.errorMessage || "Please insert your phone number");
        } else {
            alert(`Proceeding with ${selectedCountry.code} ${phoneNumber}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50"
        >
            {/* Header */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {config.translations?.title || "Your file is ready"}
            </h1>

            {/* Hero Icon */}
            <div className="flex justify-center mb-6">
                <div className="bg-white rounded-full p-4 shadow-md border-2 border-gray-100">
                    <CheckCircle className="w-12 h-12 text-gray-800" strokeWidth={2} />
                </div>
            </div>

            <p className="text-center text-gray-600 mb-6 font-medium">
                {config.translations?.subtitle || "Enter your phone number and confirm the PIN code"}
            </p>

            {/* Error Message Tooltip */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500 text-white text-sm py-2 px-4 rounded-lg mb-2 relative mx-auto w-max shadow-md"
                >
                    {error}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                </motion.div>
            )}

            {/* Phone Input */}
            <div
                className={`relative flex items-center bg-transparent border-2 rounded-xl p-1 mb-6 transition-colors duration-300 ${error ? 'border-red-400 bg-red-50' : 'bg-cyan-50/10'}`}
                style={{
                    borderColor: error ? undefined : config.primaryColor || '#00C2E0'
                }}
            >
                {/* Country Code Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="pl-3 pr-2 py-3 flex items-center gap-1.5 text-gray-700 border-r border-gray-200 hover:bg-gray-50 transition-colors rounded-l-xl min-w-[120px]"
                    >
                        <span className="text-lg leading-none emoji-flag">{selectedCountry.flag}</span>
                        <span className="text-sm font-semibold whitespace-nowrap">{selectedCountry.code}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] max-h-60 overflow-y-auto"
                            >
                                {config.countryCodes?.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCountry(country);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <span className="text-xl leading-none emoji-flag">{country.flag}</span>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800">{country.country}</div>
                                            <div className="text-sm text-gray-500">{country.code}</div>
                                        </div>
                                        {selectedCountry.code === country.code && (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full bg-transparent p-3 text-lg font-medium outline-none text-gray-800 placeholder-gray-400"
                    placeholder={config.translations?.inputPlaceholder || "Mobile number"}
                    maxLength={10}
                />
                {isValid && (
                    <CheckCircle className="w-6 h-6 text-gray-600 mr-3" />
                )}
            </div>

            {/* Continue Button */}
            <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                style={{ backgroundColor: config?.primaryColor || '#00C2E0' }}
            >
                <span className="relative z-10">{config.translations?.buttonText || "CONTINUE"}</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>

            {/* Language Toggle */}
            {config.availableLanguages && (
                <div className="mt-8 flex justify-center gap-3">
                    {config.availableLanguages.map((lang, index) => (
                        <div key={lang.code} className="flex items-center gap-3">
                            {index > 0 && <div className="w-px h-5 bg-gray-300"></div>}
                            <button
                                className={`font-bold transition-colors ${config.language === lang.code
                                    ? 'border border-gray-800 px-2 rounded-md text-gray-800'
                                    : 'text-gray-400 hover:text-gray-800'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </motion.div>
    );
}
