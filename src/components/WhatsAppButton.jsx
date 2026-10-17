
const PHONE_NUMBER = "+917744994592"; // ← तुमचा नंबर टाका
const PREFILLED_MESSAGE = "Hi! I have a question about BoardVala."; // user ला आधीच भरलेला मजकूर

export default function WhatsAppButton() {
  const link = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    PREFILLED_MESSAGE,
  )}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 1000,
        textDecoration: "none",
      }}
    >
      {/* WhatsApp icon (bootstrap-icons — आधीच install आहे) */}
      <i
        className="bi bi-whatsapp"
        style={{ color: "#fff", fontSize: "30px" }}
      ></i>
    </a>
  );
}