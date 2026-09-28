import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import InspiredDesigns from "../components/home/InspiredDesigns";
import FeaturedProductsSection from "../components/home/FeaturedProductsSection";
import CompletedProjects from "../components/home/CompletedProjects";
import DesignYourOwnSection from "../components/home/DesignYourOwnSection";
import WhyChooseBoardVala from "../components/home/WhyChooseBoardVala";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";

export const metadata = {
  title: "Custom UV Printed Products, Gifts & Home Decor | BoardVala",
  description:
    "Create personalized photo frames, wedding frames, name plates, gifts and home decor with UV printing on acrylic, MDF, sunboard and vinyl. Custom banners and ready-made decorative products also available. Delivered across India.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What materials does BoardVala print on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BoardVala offers UV printing on Acrylic, MDF, Sunboard (Foam Sheet), Vinyl, and Flex Banners. Each material suits different needs — acrylic for premium photo frames, MDF for name plates, sunboard for signage, and vinyl for stickers and wraps.",
      },
    },
    {
      "@type": "Question",
      name: "How long does delivery take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Production takes 1-2 business days. Delivery across India takes 3-7 business days depending on your location. We ship via trusted courier partners like BlueDart, Delhivery, and DTDC.",
      },
    },
    {
      "@type": "Question",
      name: "Can I upload my own design?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can upload any photo, artwork, logo, or design on our website. Choose your material and size, and we UV-print it with premium quality. We also have a gallery of ready-made designs to choose from.",
      },
    },
    {
      "@type": "Question",
      name: "What is UV printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UV printing uses ultraviolet light to cure ink instantly on any surface. This produces vibrant, scratch-resistant, waterproof prints that last for years. BoardVala uses industrial UV flatbed printers for the highest quality output.",
      },
    },
    {
      "@type": "Question",
      name: "Do you deliver across India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, BoardVala delivers across India. We ship to all serviceable pin codes via major courier partners. You can check delivery availability by entering your pincode on any product page.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <Categories />
      <InspiredDesigns />
      <FeaturedProductsSection />
      <CompletedProjects />
      <DesignYourOwnSection />
      <WhyChooseBoardVala />
      <Testimonials />
      <FAQ />
    </>
  );
}