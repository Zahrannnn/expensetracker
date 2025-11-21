import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "sonner";
import { PWAProvider } from "@/components/layout/PWAProvider";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { OnboardingGuide } from "@/components/onboarding/OnboardingGuide";

export const metadata: Metadata = {
  title: "Expense Tracker - Manage Your Finances",
  description: "Track expenses, income, and debts with powerful analytics. Available in English and Arabic.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ExpenseTracker",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Expense Tracker",
    title: "Expense Tracker - Manage Your Finances",
    description: "Track expenses, income, and debts with powerful analytics",
  },
  twitter: {
    card: "summary",
    title: "Expense Tracker",
    description: "Track your finances with ease",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const locales = ['en', 'ar'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params as required by Next.js 16
  const { locale } = await params;
  
  // Validate that the incoming locale parameter is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider defaultTheme="system" storageKey="expense-tracker-theme">
            <PWAProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 w-full overflow-auto">
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
                    <div className="flex h-14 items-center px-4">
                      <SidebarTrigger />
                    </div>
                  </div>
                  <div className="container mx-auto px-4 py-8">
                    {children}
                  </div>
                </main>
              </SidebarProvider>
              <OnboardingGuide />
              <ChatbotWidget locale={locale} />
              <Toaster position={locale === 'ar' ? 'top-left' : 'top-right'} richColors closeButton />
            </PWAProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
