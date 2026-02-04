"use client";

import { useState, useEffect } from "react";
import { Smartphone, CheckCircle, AlertCircle, ChevronDown, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Helper function to generate unique click ID
const generateClickId = () => {
    return 'click_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

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
    
    // OTP Flow states
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [clickId] = useState(generateClickId());

    // Scroll animation for language buttons
    const { scrollY } = useScroll();
    const [hasScrolled, setHasScrolled] = useState(false);
    const languageOpacity = useTransform(scrollY, [0, 20], [0, 1]);
    const languageY = useTransform(scrollY, [0, 20], [10, 0]);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setHasScrolled(latest > 5);
        });
    }, [scrollY]);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        setPhoneNumber(value);

        // Simple validation (9+ digits)
        if (value.length >= 9) {
            setIsValid(true);
            setError("");
        } else {
            setIsValid(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value;
        // Allow only numbers, max 6 digits
        if (!/^\d*$/.test(value) || value.length > 6) return;
        setOtp(value);
        setError("");
    };

    // Step 1: Generate PIN
    const handleSubmit = async () => {
        if (!isValid) {
            setError(config.translations?.errorMessage || "Please insert your phone number");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log('📱 Generating PIN for:', phoneNumber);
            console.log('📊 Service ID:', config.serviceId);
            console.log('🔑 Click ID:', clickId);

            const response = await fetch('https://kidoz.xyz/api/publisher/pin-generation/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    msisdn: phoneNumber,
                    service: config.serviceId?.toString() || "37",
                    pub_id: config.publisherId?.toString() || "13",
                    click_id: clickId
                })
            });

            const data = await response.json();
            console.log('✅ PIN Generation Response:', data);

            if (data.status === "success") {
                // Show OTP input
                setShowOtpInput(true);
            } else {
                setError(data.message || "Failed to send PIN. Please try again.");
            }
        } catch (error) {
            console.error('❌ PIN Generation Error:', error);
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify PIN
    const handleVerifyOtp = async () => {
        if (otp.length < 4) {
            setError("Please enter the PIN code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log('🔐 Verifying PIN:', otp);

            const response = await fetch('https://kidoz.xyz/api/publisher/pin-verification/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    msisdn: phoneNumber,
                    service: config.serviceId?.toString() || "37",
                    pub_id: config.publisherId?.toString() || "13",
                    click_id: clickId,
                    pin: otp
                })
            });

            const data = await response.json();
            console.log('✅ PIN Verification Response:', data);

            if (data.status === "success") {
                // Redirect to success URL
                console.log('🎉 Success! Redirecting to:', config.redirectUrl);
                
                if (config.redirectUrl) {
                    window.location.href = config.redirectUrl;
                } else {
                    setError("Verification successful!");
                }
            } else {
                setError(data.message || "Invalid PIN. Please try again.");
            }
        } catch (error) {
            console.error('❌ PIN Verification Error:', error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full sm:max-w-md min-h-screen sm:min-h-0 p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-white/50 flex flex-col justify-center"
        >
            {/* Back Button - Only show on OTP screen */}
            {showOtpInput && (
                <button
                    onClick={() => {
                        setShowOtpInput(false);
                        setOtp("");
                        setError("");
                    }}
                    disabled={isLoading}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
            )}

            {/* Header */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {showOtpInput ? "Enter PIN Code" : (config.translations?.title || "Your file is ready")}
            </h1>

            {/* Hero Icon */}
            <div className="flex justify-center mb-6">
                <div className="bg-white rounded-full p-4 shadow-md border-2 border-gray-100">
                    <CheckCircle className="w-12 h-12 text-gray-800" strokeWidth={2} />
                </div>
            </div>

            <p className="text-center text-gray-600 mb-6 font-medium">
                {showOtpInput 
                    ? `We sent a PIN to ${selectedCountry.code} ${phoneNumber}`
                    : (config.translations?.subtitle || "Enter your phone number and confirm the PIN code")
                }
            </p>

            {/* Error Message Tooltip */}
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

            {/* Phone Input or OTP Input */}
            {!showOtpInput ? (
                <>
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
                                disabled={isLoading}
                                className="pl-3 pr-2 py-3 flex items-center gap-1.5 text-gray-700 border-r border-gray-200 hover:bg-gray-50 transition-colors rounded-l-xl min-w-30 disabled:opacity-50"
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
                                        className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-50 max-h-60 overflow-y-auto"
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
                            disabled={isLoading}
                            className="w-full bg-transparent p-3 text-lg font-medium outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                            placeholder={config.translations?.inputPlaceholder || "Mobile number"}
                            maxLength={10}
                        />
                        {isValid && !isLoading && (
                            <CheckCircle className="w-6 h-6 text-gray-600 mr-3" />
                        )}
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !isValid}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ backgroundColor: config?.primaryColor || '#00C2E0' }}
                    >
                        {isLoading ? (
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending PIN...
                            </span>
                        ) : (
                            <span className="relative z-10">{config.translations?.buttonText || "CONTINUE"}</span>
                        )}
                        {!isLoading && (
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        )}
                    </button>
                </>
            ) : (
                <>
                    {/* OTP Input */}
                    <div
                        className={`relative flex items-center justify-center bg-transparent border-2 rounded-xl p-4 mb-6 transition-colors duration-300 ${error ? 'border-red-400 bg-red-50' : 'bg-cyan-50/10'}`}
                        style={{
                            borderColor: error ? undefined : config.primaryColor || '#00C2E0'
                        }}
                    >
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            disabled={isLoading}
                            className="w-full bg-transparent text-center text-2xl font-bold tracking-widest outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                            placeholder="••••••"
                            maxLength={6}
                            autoFocus
                        />
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otp.length < 4}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3"
                        style={{ backgroundColor: config?.primaryColor || '#00C2E0' }}
                    >
                        {isLoading ? (
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </span>
                        ) : (
                            <span className="relative z-10">VERIFY PIN</span>
                        )}
                        {!isLoading && (
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        )}
                    </button>

                    {/* Change Phone Number Button */}
                    <button
                        onClick={() => {
                            setShowOtpInput(false);
                            setOtp("");
                            setError("");
                        }}
                        disabled={isLoading}
                        className="w-full text-center text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                    >
                        Change phone number
                    </button>
                </>
            )}
        </motion.div>
    );
}
