import Link from "next/link";
import { getProductImage, getGalleryImage } from "../../utils/imageUtils";
import "../../styles/product-card.css";

export default function ProductCard({ product }) {
  // link — type नुसार वेगळा पेज
  let to = `/products/${product.id}`;
  if (product.type === "gallery") to = `/designs/${product.id}`;
  if (product.type === "featured") to = `/featured-products/${product.id}`;

  // image — type नुसार योग्य helper
  let imageSrc;
  if (product.type === "gallery") {
    imageSrc = getGalleryImage(product.previewImage);
  } else if (product.type === "featured") {
    imageSrc = getGalleryImage(product.previewImage); // featured पण Cloudinary
  } else {
    imageSrc = getProductImage(product.previewImage);
  }

  return (
    <div className="product-grid-item mb-4">
      <Link href={to} className="product-card-link">
        <div className="product-card h-100">
          <img
            src={imageSrc}
            className="product-card-image"
            alt={`${product.name} — ${product.type === "gallery" ? "Design" : product.type === "featured" ? "Product" : "Print"} by BoardVala`}
          />

          <div className="p-3">
            <h6 className="mb-2">{product.name}</h6>

            {product.type === "gallery" ? (
              <>
                <span className="btn btn-outline-dark btn-sm">
                  View Details
                </span>
              </>
            ) : (
              // product आणि featured — दोन्ही price दाखवतात ₹{product.price}
              <p className="product-price mb-0"></p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}