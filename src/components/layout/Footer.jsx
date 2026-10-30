import Link from "next/link";
import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="bv-footer">
      <div className="container">
        <div className="row g-4 g-md-5">

          {/* Brand Description */}
          <div className="col-lg-4 col-md-6">
            <h6 className="bv-footer-heading">BoardVala</h6>
            <p className="bv-footer-desc">
              Premium custom UV‑printed products – name plates, photo
              frames, signage &amp; home décor. Upload your design, pick a
              material, and we deliver across India.
            </p>
            {/* Socials */}
            <div className="bv-footer-socials">
              <a href="https://instagram.com/boardvala" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://facebook.com/boardvala" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://youtube.com/@boardvala" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://wa.me/918788736288" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="bv-footer-heading">Quick Links</h6>
            <ul className="bv-footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">All Designs</Link></li>
              <li><Link href="/featured-products">Featured</Link></li>
              <li><Link href="/custom-design">Upload Design</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="bv-footer-heading">Company</h6>
            <ul className="bv-footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h6 className="bv-footer-heading">Get in Touch</h6>
            <ul className="bv-footer-contact">
              <li>
                <i className="bi bi-envelope me-2"></i>
                <a href="mailto:support@boardvala.com">support@boardvala.com</a>
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i>
                <a href="tel:+918788736288">+91 8788736288</a>
              </li>
              <li>
                <i className="bi bi-geo-alt me-2"></i>
                Saturna MIDC, Amravati, Maharashtra
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="bv-footer-bottom">
          <p className="mb-0">
            © {new Date().getFullYear()} BoardVala.com — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}