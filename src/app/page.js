import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";
import { getBackendConfig } from "@/lib/config";
import { headers } from "next/headers";

export default async function Home() {
    const headersList = await headers();
    const config = await getBackendConfig(headersList);

    return (
        <main 
            className="min-h-[120vh] relative flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: config.backgroundColor || '#EAF8F9' }}
            dir={config.language === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(${config.primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${config.primaryColor} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                ></div>

                {/* Gradient Blobs - Dynamic based on primary color */}
                <div 
                    className="absolute top-0 left-0 w-125 h-125 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"
                    style={{ backgroundColor: config.primaryColor || '#00C2E0' }}
                ></div>
                <div 
                    className="absolute top-0 right-0 w-125 h-125 rounded-full mix-blend-multiply filter blur-[128px] opacity-15 animate-blob animation-delay-2000"
                    style={{ backgroundColor: config.accentColor || '#f87171' }}
                ></div>
                <div 
                    className="absolute -bottom-32 left-20 w-125 h-125 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000"
                    style={{ backgroundColor: config.secondaryColor || '#ffffff' }}
                ></div>
            </div>

            <div className="z-10 w-full h-full sm:h-auto flex flex-col justify-center items-stretch sm:items-center px-0 sm:px-4">
                <LoginForm config={config} />
            </div>

            <Footer text={config.footerText} language={config.language} availableLanguages={config.availableLanguages} />
        </main>
    );
}
