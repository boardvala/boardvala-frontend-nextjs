import FeaturedProductClient from "./FeaturedProductClient";

const API = process.env.NEXT_PUBLIC_API_URL;

// Dynamic metadata — Google/WhatsApp ला product title + image दिसतं!
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${API}/featured-products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return { title: "Product Not Found | BoardVala" };
    const product = await res.json();

    const image =
      product.images?.length > 0
        ? product.images[0]?.url || product.images[0]
        : null;

    return {
      title: `${product.title} — UV Printed | BoardVala`,
      description: `${product.title} — premium UV-printed home decor by BoardVala. Order online, delivered across India.`,
      openGraph: {
        title: `${product.title} | BoardVala`,
        description: `${product.title} — premium UV-printed product. Order online.`,
        images: image ? [{ url: image }] : [],
      },
    };
  } catch {
    return { title: "Featured Product | BoardVala" };
  }
}

async function getProduct(id) {
  try {
    const res = await fetch(`${API}/featured-products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getSimilarProducts(currentId) {
  try {
    const res = await fetch(`${API}/featured-products?activeOnly=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const all = await res.json();
    return (all || [])
      .filter((p) => p._id !== currentId)
      .slice(0, 4)
      .map((p) => ({
        id: p._id,
        type: "featured",
        name: p.title,
        price: p.price,
        previewImage: p.images?.length > 0 ? p.images[0] : null,
      }));
  } catch {
    return [];
  }
}

export default async function FeaturedProductDetailsPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  const similar = await getSimilarProducts(id);

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description:
          product.description ||
          `${product.title} — premium UV-printed product by BoardVala`,
        image: product.images?.length > 0 ? product.images[0] : "",
        brand: { "@type": "Brand", name: "BoardVala" },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "BoardVala" },
          url: `https://www.boardvala.com/featured-products/${product._id}`,
        },
        material: product.material || "",
        size: product.size || "",
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <FeaturedProductClient product={product} similar={similar} />
    </>
  );
}
