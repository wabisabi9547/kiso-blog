import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientProviders } from "@/components/providers/client-providers";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "KISO - 일상과 기술, 그리고 생각들을 담는 공간",
    template: "%s | KISO"
  },
  description: "현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자입니다.",
  keywords: ["개인 블로그", "일상", "기술", "생각", "미니멀리즘", "도파민 디톡스", "kiso"],
  authors: [{ name: "KISO" }],
  creator: "KISO",
  publisher: "KISO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kiso.blog'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
    },
  },
  openGraph: {
    title: "KISO - Full-Stack Developer & Tech Innovator",
    description: "현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자",
    url: 'https://kiso.blog',
    siteName: 'KISO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KISO 개인 블로그',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "KISO - Full-Stack Developer & Tech Innovator",
    description: "현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자",
    images: ['/og-image.png'],
    creator: '@kiso',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KISO",
    "url": "https://kiso.blog",
    "description": "현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자",
    "author": {
      "@type": "Person",
      "name": "KISO"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kiso.blog/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ko" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://kiso.blog" />
        <meta name="google-adsense-account" content={process.env.GOOGLE_ADSENSE_ID} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ClientProviders>
          <div className="relative min-h-screen flex flex-col">
            {/* Background gradient overlay */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.05),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent)]" />
            </div>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
