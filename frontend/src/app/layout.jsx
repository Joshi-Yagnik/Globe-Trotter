import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata = {
  title: 'GlobeTrotter — AI-Powered Travel Planner',
  description: 'Plan your perfect trip with AI-powered suggestions, build detailed itineraries, and share adventures with the community. Built for Odoo x LDCE Ahmedabad Hackathon 26.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-body bg-[#06080f] text-white min-h-screen antialiased`}>
        <ToastProvider>
          {/* Animated background mesh */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full bg-teal-400/10 blur-3xl -top-48 -right-48 animate-float" />
            <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl -bottom-36 -left-36 animate-float-reverse" />
          </div>
          <div className="relative z-10">
            <Navbar />
            <main>{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
