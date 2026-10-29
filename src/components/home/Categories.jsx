import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "MDF",
    image: "/categories/Mdf.png",
    alt: "MDF UV Printing — Custom Name Plates & Wall Art on MDF Wood Board",
    startingPrice: 299,
  },
  {
    id: 2,
    name: "Acrylic",
    image: "/categories/Acrylic.png",
    alt: "Acrylic UV Printing — Premium Photo Frames & Name Plates on Acrylic Sheet",
    startingPrice: 499,
  },
  {
    id: 3,
    name: "PVC Sunboard",
    image: "/categories/Sunboard.png",
    alt: "Sunboard Foam Sheet Printing — Affordable Signage & Display Boards",
    startingPrice: 249,
  },
  {
    id: 4,
    name: "Vinyl Stickers",
    image: "/categories/Vinyl.png",
    alt: "Vinyl Sticker Printing — Custom Wall Graphics, Shop Branding & Vehicle Wraps",
    startingPrice: 149,
  },
];

const marqueeItems = [...categories, ...categories];

export default function Categories() {
  return (
    <section className="py-5">
      <style>{`
        .cat-section-title {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .cat-section-sub {
          font-family: 'Georgia', 'Times New Roman', serif;
          color: #64748b;
        }

        .cat-marquee {
          overflow: hidden;
          width: 100%;
        }

        .cat-marquee__track {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cat-card {
          overflow: hidden;
          background: #fff;
          border: 1px solid #ecedef;
          border-radius: 0;
          transition: transform .18s ease, box-shadow .18s ease;
          width: 240px;
        }
        .cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(15,23,42,.12);
        }
        .cat-card__imgwrap {
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .cat-card__body {
          padding: 12px;
          text-align: center;
        }
        .cat-card__name {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-weight: 700;
          margin: 0 0 2px;
          font-size: 1.05rem;
        }
        .cat-card__price {
          font-family: 'Georgia', 'Times New Roman', serif;
          color: #16a34a;
          font-weight: 600;
          font-size: 0.88rem;
          margin: 0;
        }

        /* Desktop — hide duplicate cards */
        .cat-card.duplicate {
          display: none;
        }

        /* Mobile — marquee effect */
        @media (max-width: 575.98px) {
          
              .cat-marquee {
    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 0%,
      #000 10%,
      #000 90%,
      transparent 100%
    );
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      #000 10%,
      #000 90%,
      transparent 100%
    );
  }
          .cat-marquee__track {
            flex-wrap: nowrap;
            justify-content: flex-start;
            width: max-content;
            gap: 12px;
            animation: catScroll 15s linear infinite;
          }

          .cat-card {
            width: 200px;
            flex-shrink: 0;
          }
          .cat-card__body { padding: 8px 6px; }
          .cat-card__name { font-size: .88rem; }
          .cat-card__price { font-size: .78rem; }

          /* Mobile — show duplicate cards for seamless loop */
          .cat-card.duplicate {
            display: block;
          }
        }

        @keyframes catScroll {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
      `}</style>

      <div className="container text-center mb-4">
        <h2 className="cat-section-title mb-2">Our Materials</h2>
        <p className="cat-section-sub mb-0">
          We offer UV printing on premium materials.
        </p>
      </div>

      <div className="cat-marquee">
        <div className="cat-marquee__track">
          {marqueeItems.map((category, i) => (
            <div
              className={`cat-card ${i >= categories.length ? "duplicate" : ""}`}
              key={`${category.id}-${i}`}
            >
              <div className="cat-card__imgwrap">
                <Image
                  src={category.image}
                  alt={category.alt}
                  width={260}
                  height={195}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <div className="cat-card__body">
                <h5 className="cat-card__name">{category.name}</h5>
                <p className="cat-card__price">From ₹{category.startingPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}