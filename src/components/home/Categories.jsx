
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

export default function Categories() {
  return (
    <section className="py-5">
      <style>{`
        .cat-card {
          position: relative;
          border: 1px solid #ecedef;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 6px 20px rgba(15,23,42,.06);
          transition: transform .18s ease, box-shadow .18s ease;
          height: 100%;
        }
        .cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(15,23,42,.14);
        }
        .cat-card__imgwrap {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .cat-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cat-card__body {
          padding: 12px;
          text-align: center;
        }
        .cat-card__name {
          font-weight: 700;
          margin: 0 0 2px;
          font-size: 1.05rem;
        }
        .cat-card__link {
          font-size: .82rem;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
        }

        /* Mobile — tighter card so 2 per row fit nicely */
        @media (max-width: 575.98px) {
          .cat-card__body { padding: 8px 6px; }
          .cat-card__name { font-size: .9rem; }
          .cat-card__link { font-size: .72rem; }
        }
      `}</style>

      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Our Materials</h2>
          <p className="text-muted mb-0">
            We offer UV printing on premium materials.
          </p>
        </div>

        <div className="row g-3 g-md-4">
          {categories.map((category) => (
            <div className="col-6 col-md-3" key={category.id}>
              <div className="cat-card d-block text-dark">
                <div className="cat-card__imgwrap">
                  <img
                    src={category.image}
                    className="cat-card__img"
                    alt={category.alt}
                  />
                </div>
                <div className="cat-card__body">
                  <h5 className="cat-card__name">{category.name}</h5>
                  <p className="text-success fw-semibold small mb-2">
                    From ₹{category.startingPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
