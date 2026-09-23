// src/app/contact/page.js
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us | BoardVala",
  description: "Get in touch with BoardVala for custom UV printing, name plates, photo frames and signage. Call, email or WhatsApp us.",
};

export default function ContactPage() {
  return <ContactClient />;
}