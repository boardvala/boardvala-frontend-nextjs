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

export default function Home() {
  return (
    <>
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