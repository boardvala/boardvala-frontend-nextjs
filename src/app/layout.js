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

        {/* Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "BoardVala",
              image: "https://www.boardvala.com/og-preview.jpg",
              url: "https://www.boardvala.com",
              telephone: "+918329860034",
              email: "support@boardvala.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "C9, dps road, Saturna midc, near ajmera tyre, badnera road",
                addressLocality: "Amravati",
                addressRegion: "Maharashtra",
                postalCode: "444607",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 20.932,
                longitude: 77.7523,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: "10:00",
                closes: "20:00",
              },
              sameAs: [
                "https://www.instagram.com/boardvala",
                "https://www.facebook.com/boardvala",
              ],
              priceRange: "₹150 - ₹5000",
              description:
                "Custom UV printing on acrylic, MDF, sunboard & vinyl. Photo frames, name plates, signage & home decor. Order online, delivered across India.",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "UV Printing Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Acrylic UV Printing",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "MDF Name Plate Printing",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Sunboard Signage Printing",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Vinyl Sticker Printing",
                    },
                  },
                ],
              },
            }),
          }}
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
