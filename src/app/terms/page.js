// src/app/about/page.js
import TermsClient from "./TermsClient";

export const metadata = {
  title: "Terms & Conditions | BoardVala",
  description: "Read BoardVala's terms and conditions for ordering custom UV-printed products, shipping, returns and refunds.",
};

export default function TermsPage() {
  return <TermsClient />;
}