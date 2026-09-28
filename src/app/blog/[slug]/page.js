import Link from "next/link";
import "../../../styles/blog.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${API}/blogs/slug/${slug}`, { cache: "no-store" });
    if (!res.ok) return { title: "Blog | BoardVala" };
    const blog = await res.json();

    return {
      title: `${blog.metaTitle || blog.title} | BoardVala Blog`,
      description: blog.metaDescription || blog.excerpt,
      keywords: (blog.tags || []).join(", "),
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        images: blog.coverImage ? [{ url: blog.coverImage }] : [],
        type: "article",
      },
      alternates: {
        canonical: `https://www.boardvala.com/blog/${slug}`,
      },
    };
  } catch {
    return { title: "Blog | BoardVala" };
  }
}

async function getBlog(slug) {
  try {
    const res = await fetch(`${API}/blogs/slug/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="container py-5 text-center">
        <h2>Article Not Found</h2>
        <Link href="/blog" className="btn btn-dark mt-3">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const articleSchema = blog
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.coverImage || "",
        author: {
          "@type": "Organization",
          name: "BoardVala",
          url: "https://www.boardvala.com",
        },
        publisher: {
          "@type": "Organization",
          name: "BoardVala",
          logo: {
            "@type": "ImageObject",
            url: "https://www.boardvala.com/boardvala_logo.png",
          },
        },
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.boardvala.com/blog/${slug}`,
        },
        keywords: (blog.tags || []).join(", "),
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <article className="blog-detail-wrap py-4 py-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Back */}
              <Link href="/blog" className="blog-back-link mb-4 d-inline-block">
                ← Back to Blog
              </Link>

              {/* Category + Date */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                {blog.category && (
                  <span className="blog-detail-cat">{blog.category}</span>
                )}
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  · {blog.readTime} min read
                </span>
              </div>

              {/* Title */}
              <h1 className="blog-detail-title">{blog.title}</h1>

              {/* Cover Image */}
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="blog-detail-cover"
                />
              )}

              {/* Content — HTML render */}
              <div
                className="blog-detail-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="blog-detail-tags mt-5">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="blog-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="blog-cta mt-5">
                <h4>Ready to create something amazing?</h4>
                <p className="text-muted">
                  Upload your design and get premium UV printing on any
                  material.
                </p>
                <Link href="/custom-design" className="btn btn-dark btn-lg">
                  Upload Your Design →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
