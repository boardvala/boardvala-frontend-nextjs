const API = process.env.NEXT_PUBLIC_API_URL;

export default async function sitemap() {
  // Static pages
  const staticPages = [
    {
      url: "https://www.boardvala.com",
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://www.boardvala.com/products",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.boardvala.com/featured-products",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.boardvala.com/custom-design",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: "https://www.boardvala.com/blog", changeFrequency: "weekly", priority: 0.8 },
    {
      url: "https://www.boardvala.com/about",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.boardvala.com/contact",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.boardvala.com/terms",
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic — Gallery designs
  let galleryPages = [];
  try {
    const res = await fetch(`${API}/gallery`, { cache: "no-store" });
    const designs = await res.json();
    galleryPages = (designs || []).map((d) => ({
      url: `https://www.boardvala.com/designs/${d.slug || d._id}`,
      lastModified: d.updatedAt || d.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    console.log("Sitemap: gallery fetch failed");
  }

  // Dynamic — Featured products
  let featuredPages = [];
  try {
    const res = await fetch(`${API}/featured-products?activeOnly=true`, {
      cache: "no-store",
    });
    const products = await res.json();
    featuredPages = (products || []).map((p) => ({
      url: `https://www.boardvala.com/featured-products/${p.slug || p._id}`,
      lastModified: p.updatedAt || p.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    console.log("Sitemap: featured fetch failed");
  }

  // Dynamic — Blog posts
  let blogPages = [];
  try {
    const res = await fetch(`${API}/blogs/published`, { cache: "no-store" });
    const blogs = await res.json();
    blogPages = (blogs || []).map((b) => ({
      url: `https://www.boardvala.com/blog/${b.slug}`,
      lastModified: b.updatedAt || b.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    console.log("Sitemap: blogs fetch failed");
  }

  return [...staticPages, ...galleryPages, ...featuredPages, ...blogPages];
}
