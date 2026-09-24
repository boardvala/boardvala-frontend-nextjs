export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/cart", "/checkout", "/login", "/register", "/order-success", "/review-custom-design"],
      },
    ],
    sitemap: "https://www.boardvala.com/sitemap.xml",
  };
}