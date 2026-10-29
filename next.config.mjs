/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
  devIndicators: false,

  async redirects() {
    return [
      {
        source: "/index.php/product/:slug",
        destination: "/featured-products/:slug",
        permanent: true,
      },
      {
        source: "/index.php/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;