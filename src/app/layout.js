import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { AuthProvider } from "../context/AuthContext";
import LayoutShell from "./LayoutShell";
import Script from "next/script";

export const metadata = {
  title: "Acrylic Photo Frames, Name Plates & UV Printing Online | BoardVala",
  description:
    "Order custom UV-printed acrylic photo frames, wedding frames, personalized gifts, name plates on acrylic & MDF, sunboard signage, vinyl prints and flex banners online. Upload your design, choose material and size. Delivered across India.",
  keywords:
    "acrylic photo frame, custom name plate, UV printing online, wedding photo frame, personalized gifts, MDF name plate, sunboard signage, BoardVala",
  openGraph: {
    title: "Custom Photo Frames, Name Plates & UV Printing | BoardVala",
    description:
      "Acrylic photo frames, wedding frames, personalized gifts, name plates, signage and banners. Upload your design, get it UV-printed. Delivered across India.",
    url: "https://boardvala.com",
    siteName: "BoardVala",
    images: [
      {
        url: "https://boardvala.com/og-preview.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom acrylic Photo Frames, Name Plates & UV Printing | BoardVala",
    description:
      "Acrylic photo frames, wedding frames, personalized gifts, name plates, signage and banners. Delivered across India.",
    images: ["https://boardvala.com/og-preview.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/boardvala-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="7mgDaMN1go1u0TZHxNcR9fQ3KanFMRVP816kxwOJEYo"
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q3Y6L2ZPHX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q3Y6L2ZPHX');
          `}
        </Script>
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}