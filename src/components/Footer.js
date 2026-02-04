"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function Footer({ text, language, availableLanguages }) {
    const { scrollY } = useScroll();
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setHasScrolled(latest > 5);
        });
        return unsubscribe;
    }, [scrollY]);

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: hasScrolled ? 1 : 0, 
                y: hasScrolled ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50 ${hasScrolled ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-hidden={!hasScrolled}
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
                {/* Language Toggle */}
                {availableLanguages && availableLanguages.length > 0 && (
                    <div className="flex justify-center gap-3">
                        {availableLanguages.map((lang, index) => (
                            <div key={lang.code} className="flex items-center gap-3">
                                {index > 0 && <div className="w-px h-5 bg-gray-300"></div>}
                                <button
                                    className={`font-bold transition-colors ${language === lang.code
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
                
                {/* Footer Text */}
                <p className="text-center text-xs text-gray-400" dir={language === "ar" ? "rtl" : "ltr"}>
                    {text}
                </p>
            </div>
        </motion.footer>
    );
}
