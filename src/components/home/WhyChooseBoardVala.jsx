export default function WhyChooseBoardVala() {
  const features = [
    {
      icon: "🏆",
      title: "Premium Quality",
      description:
        "Crafted on premium Mdf today, with acrylic, Sunboard and Vinyl finishes on the way — built to last and look elegant.",
    },
    {
      icon: "🎨",
      title: "Your Design, Your Way",
      description:
        "Upload your own artwork, logo or photo and choose the exact size that fits your door.",
    },
    {
      icon: "🏭",
      title: "Professional Manufacturing",
      description:
        "Produced with precision laser cutting and UV printing for a clean, premium finish.",
    },
    {
      icon: "🚚",
      title: "Pan India Delivery",
      description:
        "Safe packaging and reliable shipping to customers across India.",
    },
  ];

  return (
    <section className="py-5 bg-white">
      <style>{`
        .why-card {
          border: 1px solid #eef0f2;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 6px 20px rgba(15,23,42,.05);
          transition: transform .18s ease, box-shadow .18s ease;
          height: 100%;
        }
        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15,23,42,.12);
        }
        .why-icon {
          display: inline-grid;
          place-items: center;
          width: 64px; height: 64px;
          border-radius: 16px;
          background: #eef4ff;
          font-size: 2rem;
          margin: 0 auto;
        }
      `}</style>

      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Why Choose BoardVala?</h2>
          <p className="text-muted fs-5 mb-0">
            Your design, crafted with modern manufacturing into a beautiful,
            long-lasting name plate.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="why-card">
                <div className="card-body text-center p-4">
                  <div className="why-icon">{feature.icon}</div>
                  <h5 className="mt-3 fw-bold">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}