"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function LanguageToggle({ availableLanguages, currentLanguage }) {
    const { scrollY } = useScroll();
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setHasScrolled(latest > 5);
        });
        return unsubscribe;
    }, [scrollY]);

    if (!availableLanguages) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
                opacity: hasScrolled ? 1 : 0, 
                y: hasScrolled ? 0 : 10 
            }}
            transition={{ duration: 0.3 }}
            className={`mt-6 flex justify-center gap-3 z-20 ${hasScrolled ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            {availableLanguages.map((lang, index) => (
                <div key={lang.code} className="flex items-center gap-3">
                    {index > 0 && <div className="w-px h-5 bg-gray-300"></div>}
                    <button
                        className={`font-bold transition-colors ${currentLanguage === lang.code
                            ? 'border border-gray-800 px-2 rounded-md text-gray-800'
                            : 'text-gray-400 hover:text-gray-800'
                            }`}
                    >
                        {lang.label}
                    </button>
                </div>
            ))}
        </motion.div>
    );
}
