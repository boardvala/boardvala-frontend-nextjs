export default function Testimonials() {
  const testimonials = [
    {
      name: "Kunal Rathi",
      location: "Amravati, Maharashtra",
      rating: 5,
      review:
        "Excellent quality name plate with a premium finish. The customization process was smooth and the final product exceeded my expectations.",
    },
    {
      name: "Mahesh Prajapati",
      location: "Nagpur, Maharashtra",
      rating: 5,
      review:
        "Professional service and timely delivery. The material quality is impressive and looks great at my home entrance.",
    },
    {
      name: "Utkarsh Thakare",
      location: "Pune, Maharashtra",
      rating: 5,
      review:
        "I uploaded my own design and BoardVala manufactured it exactly as requested. Highly satisfied with the result.",
    },
    {
      name: "Sneha Kulkarni",
      location: "Nashik, Maharashtra",
      rating: 5,
      review:
        "Beautiful wooden name plate for our new flat. The finishing is neat and the size was exactly what we wanted.",
    },
    {
      name: "Rohit Deshmukh",
      location: "Aurangabad, Maharashtra",
      rating: 5,
      review:
        "Simple process — uploaded my design, picked the size, and it arrived well packed. Looks premium on the door.",
    },
  ];

  // seamless loop साठी reviews दोनदा ठेवतो
  const loop = [...testimonials, ...testimonials];

  function initials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <section className="py-5 bg-light">
      <style>{`
        .tm-head { text-align: center; margin-bottom: 2.5rem; }

        .tm-marquee {
          overflow: hidden;
          position: relative;
          max-width: 100vw;
          -webkit-mask-image: linear-gradient(
            to right, transparent, #000 8%, #000 92%, transparent
          );
          mask-image: linear-gradient(
            to right, transparent, #000 8%, #000 92%, transparent
          );
        }
        .tm-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: tmScroll 40s linear infinite;
        }
        .tm-marquee:hover .tm-track {
          animation-play-state: paused;
        }
        @keyframes tmScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tm-track {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        .tm-card {
          flex: 0 0 auto;
          width: 340px;
          max-width: 80vw;
          background: #fff;
          border: 1px solid #eef0f2;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(15,23,42,.06);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .tm-stars { color: #f59e0b; font-size: 1rem; margin-bottom: 12px; }
        .tm-quote {
          color: #334155;
          line-height: 1.6;
          margin-bottom: 18px;
          flex-grow: 1;
        }
        .tm-person { display: flex; align-items: center; gap: 12px; }
        .tm-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #2563eb;
          color: #fff;
          font-weight: 700;
          display: grid;
          place-items: center;
          font-size: .95rem;
          flex-shrink: 0;
        }
        .tm-name { font-weight: 700; margin: 0; line-height: 1.2; }
        .tm-loc { color: #94a3b8; font-size: .85rem; }
      `}</style>

      <div className="container">
        <div className="tm-head">
          <h2 className="fw-bold mb-2">What Our Customers Say</h2>
          <p className="text-muted fs-5 mb-0">
            Real name plates, delivered to homes across Maharashtra and beyond.
          </p>
        </div>
      </div>

      <div className="tm-marquee">
        <div className="tm-track">
          {loop.map((item, index) => (
            <div className="tm-card" key={index}>
              <div className="tm-stars">{"★".repeat(item.rating)}</div>
              <p className="tm-quote">“{item.review}”</p>
              <div className="tm-person">
                <div className="tm-avatar">{initials(item.name)}</div>
                <div>
                  <p className="tm-name">{item.name}</p>
                  <span className="tm-loc">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}