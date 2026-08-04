import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zenoarete.com"),
  title: "Zeno Arete | Six-Suite Private Villa in Pererenan, Bali",
  description:
    "A 1,400 m² private villa with six named king suites, two pools, gym, sauna, ice bath, jacuzzi, cinema and full-time staff in Pererenan, Bali.",
  openGraph: {
    title: "Zeno Arete | Private Villa in Pererenan, Bali",
    description:
      "Six named suites, two pools, private gym, complete recovery facilities and full-time staff in a 1,400 m² Pererenan residence.",
    type: "website",
    url: "https://zenoarete.com",
    images: [
      {
        url: "/images/airbnb/photo-034-1440.webp",
        width: 1440,
        height: 960,
        alt: "Villa Zeno Arete pool courtyard in Pererenan, Bali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeno Arete | Private Villa in Pererenan, Bali",
    description:
      "Six named suites, two pools, private gym and complete recovery facilities.",
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="lazyOnload">{`
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
      </head>
      <body>
        {children}
        <Script
          defer
          src="/_vercel/insights/script.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
