"use client";

export default function Contact() {
  return (
    <>
      <div className="container py-4">
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2">Contact Us</h1>
          <p className="text-muted mb-0">
            We'd love to hear from you. Feel free to reach out for product
            inquiries, custom designs, bulk orders, or technical support.
          </p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <h4 className="fw-bold mb-3">Get in Touch</h4>

                <p className="mb-3">
                  Our team is available to assist you with custom name plates,
                  sign boards, pricing, order status, and any other questions
                  you may have.
                </p>

                <p className="mb-3">
                  <strong>📍 Address</strong>
                  <br />
                  Saturna Midc, Amravati, Maharashtra.
                </p>

                <p className="mb-3">
                  <strong>📞 Phone</strong>
                  <br />
                  +91 9172914161
                </p>

                <p className="mb-3">
                  <strong>✉️ Email</strong>
                  <br />
                  support@boardvala.com
                </p>

                <p className="mb-0">
                  <strong>🕒 Business Hours</strong>
                  <br />
                  Monday – Saturday
                  <br />
                  10:00 AM – 7:00 PM
                </p>
              </div>

              <div className="col-lg-6 mt-4 mt-lg-0">
                <h4 className="fw-bold mb-3">Follow Us</h4>

                <p className="mb-3">
                  Stay connected with us for our latest designs, offers, and
                  updates.
                </p>

                <p className="mb-2">
                  <strong>Instagram</strong>
                  <br />
                  @boardvala
                </p>

                <p className="mb-4">
                  <strong>Facebook</strong>
                  <br />
                  @boardvala
                </p>

                <div className="alert alert-light border mb-0">
                  <strong>Need a Custom Design?</strong>
                  <br />
                  Upload your design through our website or contact us directly.
                  We'll help you create the perfect name plate for your home or
                  business.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
