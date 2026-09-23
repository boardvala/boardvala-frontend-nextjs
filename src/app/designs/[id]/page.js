import GalleryDesignClient from "./GalleryDesignClient";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${API}/gallery/${id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Design Inspiration | BoardVala" };
    const design = await res.json();

    const image =
      design.images?.length > 0
        ? design.images[0]?.url || design.images[0]
        : null;

    return {
      title: `${design.title} — UV Print Design | BoardVala`,
      description: `${design.title} — UV print & home decor idea by BoardVala. Upload your own on ${design.category} and order online.`,
      openGraph: {
        title: `${design.title} | BoardVala`,
        description: `${design.title} — custom UV print design. Order online.`,
        images: image ? [{ url: image }] : [],
      },
    };
  } catch {
    return { title: "Design Inspiration | BoardVala" };
  }
}

async function getDesign(id) {
  try {
    const res = await fetch(`${API}/gallery/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getSimilar(id) {
  try {
    const res = await fetch(`${API}/gallery/${id}/similar`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getPricing(material) {
  try {
    const res = await fetch(`${API}/pricing/${material}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function GalleryDesignDetailsPage({ params }) {
  const { id } = await params;
  const design = await getDesign(id);

  let similar = [];
  let pricing = null;

  if (design) {
    [similar, pricing] = await Promise.all([
      getSimilar(id),
      getPricing(design.category),
    ]);
  }

  return (
    <GalleryDesignClient
      design={design}
      similarDesigns={similar}
      pricing={pricing}
    />
  );
}