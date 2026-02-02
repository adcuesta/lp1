"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Footer({ text, language }) {
    const { scrollY } = useScroll();
    const [hasScrolled, setHasScrolled] = useState(false);

    // Animate opacity based on scroll position (0 to 50px)
    const opacity = useTransform(scrollY, [0, 20], [0, 1]);
    const y = useTransform(scrollY, [0, 20], [20, 0]);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setHasScrolled(latest > 5);
        });
    }, [scrollY]);

    return (
        <motion.footer
            style={{ opacity, y }}
            className={`fixed bottom-0 left-0 w-full p-4 text-center text-xs text-gray-400 bg-white/90 backdrop-blur-md border-t border-gray-100 transition-all duration-300 pointer-events-none ${hasScrolled ? "pointer-events-auto" : ""}`}
            aria-hidden={!hasScrolled}
        >
            <div className="max-w-4xl mx-auto">
                <p dir={language === "ar" ? "rtl" : "ltr"}>{text}</p>
            </div>
        </motion.footer>
    );
}
