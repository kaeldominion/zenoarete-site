import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zeno Arete — Private Luxury Villa in Pererenan, Bali",
  description:
    "A Private Sanctuary for Training, Recovery, and Luxury Living. 6 Ultra-Luxe Suites, 2 Pools, Ice Bath, Sauna, Gym, Full-Time Chef. Pererenan, Bali.",
  openGraph: {
    title: "Zeno Arete — Luxury Villa, Bali",
    description:
      "A Private Sanctuary for Training, Recovery, and Luxury Living. 6 Suites · 2 Pools · Ice Bath · Sauna · Gym · Chef.",
    type: "website",
    url: "https://zenoarete.com",
    images: ["/images/hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeno Arete — Luxury Villa, Bali",
    description:
      "A Private Sanctuary for Training, Recovery, and Luxury Living.",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2092098044968379');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2092098044968379&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Script id="behold-widget" strategy="afterInteractive">{`
          (() => { const d=document,s=d.createElement("script");s.type="module";s.src="https://w.behold.so/widget.js";d.head.append(s); })();
        `}</Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script
          defer
          src="/_vercel/insights/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
