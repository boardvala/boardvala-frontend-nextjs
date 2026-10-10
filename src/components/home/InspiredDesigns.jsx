"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SkeletonProductCard } from "../Skeleton";
import { getGalleryDesigns } from "../../services/galleryDesignService";
import ProductCard from "../product/ProductCard";

const LIMIT = 5;

export default function InspiredDesigns() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const gallery = await getGalleryDesigns();

      // फक्त inspiration gallery (products इथे नको — ते वेगळे)
      const galleryItems = (gallery || []).map((design) => ({
        id: design._id,
        slug: design.slug,
        type: "gallery",
        name: design.title,
        price: design.price,
        previewImage:
          Array.isArray(design.images) && design.images.length > 0
            ? design.images[0]
            : null,
      }));

      setItems(galleryItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const featured = items.slice(0, LIMIT);

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Design Inspiration</h2>
          <p className="text-muted mb-0">
            Get inspired — then upload your own to make it yours.
          </p>
        </div>

        <Link
          href="/products"
          className="btn btn-outline-dark d-none d-sm-inline-block"
        >
          View all designs →
        </Link>
      </div>

      {loading ? (
        <div className="row g-4">
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>
      ) : featured.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "2.2rem" }}>🎨</div>
          <h5 className="fw-semibold mt-2 mb-1">No designs yet</h5>
          <p className="text-muted mb-0">
            New designs are on the way. Meanwhile, you can upload your own.
          </p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {featured.map((item) => (
              <ProductCard key={`${item.type}-${item.id}`} product={item} />
            ))}
          </div>

          <div className="text-center mt-4 d-sm-none">
            <Link href="/products" className="btn btn-outline-dark">
              View all designs →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
