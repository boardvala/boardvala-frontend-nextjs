import Link from "next/link";
import { getGalleryImage } from "../../utils/imageUtils";
import "../../styles/featured-products.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export const metadata = {
  title: "Featured Products & Home Decor — UV Printing | BoardVala",
  description:
    "Browse our featured UV-printed products and home decor — name plates, acrylic prints, banners and more on premium materials. Order online, delivered across India.",
};

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API}/featured-products?activeOnly=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <div className="fp-wrap py-4 py-md-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="fp-head-title mb-1">Featured Products</h2>
          <p className="text-muted mb-0">
            Ready-to-order products, crafted and finished by BoardVala.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="fp-empty">No featured products available yet.</div>
        ) : (
          <div className="row g-3 g-md-4">
            {products.map((product) => (
              <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                <Link
                  href={`/featured-products/${product._id}`}
                  className="fp-card"
                >
                  <img
                    src={getGalleryImage(product.images[0])}
                    alt={product.title}
                    className="fp-card-img"
                  />

                  <div className="fp-card-body">
                    {product.category && (
                      <span className="fp-card-cat">{product.category}</span>
                    )}

                    <h3 className="fp-card-title">{product.title}</h3>

                    {!product.inStock && (
                      <span className="fp-out">Out of stock</span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}