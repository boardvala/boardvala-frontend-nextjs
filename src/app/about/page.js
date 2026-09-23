// src/app/about/page.js
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About BoardVala — Custom UV Printing & Home Decor",
  description: "BoardVala offers premium custom UV printing services — name plates, photo frames, signage and home decor. Based in Maharashtra, delivering across India.",
};

export default function AboutPage() {
  return <AboutClient />;
}