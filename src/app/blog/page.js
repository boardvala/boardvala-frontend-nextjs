import Link from "next/link";
import "../../styles/blog.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export const metadata = {
  title: "Blog — UV Printing Guides, Material Tips & Design Ideas | BoardVala",
  description:
    "Learn about acrylic, MDF, sunboard & vinyl printing. Material guides, design ideas, buying tips and UV printing knowledge. BoardVala blog.",
  keywords:
    "acrylic printing guide, MDF name plate, sunboard signage, vinyl printing, UV printing blog",
  alternates: {
    canonical: "https://www.boardvala.com/blog",
  },
};

async function getBlogs() {
  try {
    const res = await fetch(`${API}/blogs/published`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="blog-wrap py-4 py-md-5">
      <div className="container">
        <div className="mb-4">
          <h1 className="blog-head-title mb-1">Blog</h1>
          <p className="text-muted mb-0">
            Material guides, design ideas & UV printing tips.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No articles yet. Coming soon!
          </div>
        ) : (
          <div className="row g-4">
            {blogs.map((blog) => (
              <div className="col-12 col-md-6 col-lg-4" key={blog._id}>
                <Link href={`/blog/${blog.slug}`} className="blog-card">
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="blog-card-img"
                    />
                  )}
                  <div className="blog-card-body">
                    {blog.category && (
                      <span className="blog-card-cat">{blog.category}</span>
                    )}
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                    <div className="blog-card-meta">
                      <span>{blog.readTime} min read</span>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
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