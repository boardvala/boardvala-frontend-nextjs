"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SkeletonProductCard } from "../Skeleton";
import { getFeaturedProducts } from "../../services/featuredProductService";
import ProductCard from "../product/ProductCard";

const LIMIT = 5;

export default function FeaturedProductsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      // user ला फक्त active products
      const products = await getFeaturedProducts({ activeOnly: "true" });

      const mapped = (products || []).map((p) => ({
        id: p._id,
        slug: p.slug,
        type: "featured",
        name: p.title,
        price: p.price,
        previewImage:
          Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      }));

      setItems(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // काहीच नसेल तर section लपवा (रिकामं दाखवण्यापेक्षा)
  if (!loading && items.length === 0) return null;

  const featured = items.slice(0, LIMIT);

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Featured Products</h2>
          <p className="text-muted mb-0">
            Ready-to-order products, crafted and finished by BoardVala.
          </p>
        </div>

        <Link
          href="/featured-products"
          className="btn btn-outline-dark d-none d-sm-inline-block"
        >
          View all →
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
      ) : (
        <>
          <div className="row g-4">
            {featured.map((item) => (
              <ProductCard key={`featured-${item.id}`} product={item} />
            ))}
          </div>

          <div className="text-center mt-4 d-sm-none">
            <Link href="/featured-products" className="btn btn-outline-dark">
              View all →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
