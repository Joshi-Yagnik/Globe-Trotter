import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata = {
  title: 'GlobeTrotter — AI-Powered Travel Planner',
  description: 'Plan your perfect trip with AI-powered suggestions, build detailed itineraries, and share adventures with the community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-body bg-[#07111F] text-[#F8FAFC] min-h-screen antialiased selection:bg-[#22D3A7]/30`}>
        <ToastProvider>
          {/* Animated Travel Orbit background mesh */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute w-[800px] h-[800px] rounded-full bg-[#22D3A7]/5 blur-[120px] -top-64 -right-64 animate-float" />
            <div className="absolute w-[600px] h-[600px] rounded-full bg-[#7C5CFC]/10 blur-[100px] -bottom-48 -left-48 animate-float-reverse" />
            
            {/* Subtle orbit rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] border border-white/5 rounded-full animate-[spin_120s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] border border-white/5 rounded-full animate-[spin_90s_linear_infinite_reverse]" />
          </div>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
