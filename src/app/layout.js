import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast'

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillStones - Find Your Next Project",
  description: "Connect with project owners and contribute to exciting projects",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 
            'bg-teal-600 hover:bg-teal-700 text-sm normal-case',
          card: 'bg-white shadow-xl',
          headerTitle: 'text-teal-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 
            'border border-gray-300 hover:bg-gray-50 text-sm normal-case',
          formFieldInput: 
            'rounded-md border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500',
          footerActionLink: 'text-teal-600 hover:text-teal-700',
        },
      }}
      localization={{
        signIn: {
          title: "Welcome back",
          subtitle: "Sign in to your account",
        },
        signUp: {
          title: "Create your account",
          subtitle: "Sign up to get started",
        },
      }}
    >
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
