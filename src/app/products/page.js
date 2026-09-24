import ProductCard from "../../components/product/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

export const metadata = {
  title: "All Designs — Acrylic Photo Frames, Name Plates, UV Prints | BoardVala",
  description:
    "Browse design ideas for acrylic photo frames, custom name plates, MDF prints, sunboard signage, wedding frames and personalized gifts. Upload your own design for UV printing.",
  keywords: "acrylic photo frame designs, name plate designs, UV print designs, wedding frame ideas, personalized gift designs",
  alternates: {
    canonical: "https://www.boardvala.com/products",
  },
};

async function getProducts() {
  try {
    const res = await fetch(`${API}/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getGalleryDesigns() {
  try {
    const res = await fetch(`${API}/gallery`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Products() {
  const [products, gallery] = await Promise.all([
    getProducts(),
    getGalleryDesigns(),
  ]);

  const productItems = (products || []).map((product) => ({
    id: product._id,
    type: "product",
    name: product.name,
    price: product.price,
    category: product.category,
    previewImage: product.previewImage,
    ...product,
  }));

  const galleryItems = (gallery || []).map((design) => ({
    id: design._id,
    type: "gallery",
    name: design.title,
    price: design.price,
    category: design.category,
    previewImage: design.images[0],
    ...design,
  }));

  const allItems = [...productItems, ...galleryItems];

  return (
    <div className="container py-5">
      <h2 className="mb-4">All Designs</h2>

      {allItems.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No designs available yet.
        </div>
      ) : (
        <div className="row">
          {allItems.map((item) => (
            <ProductCard key={`${item.type}-${item.id}`} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}