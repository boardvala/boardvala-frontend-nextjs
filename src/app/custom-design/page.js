import { Suspense } from "react";
import CustomDesignClient from "./CustomDesignClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upload Your Design — Custom UV Printing on Acrylic, MDF, Sunboard | BoardVala",
  description:
    "Upload your own photo, artwork or logo. Choose acrylic, MDF, sunboard, vinyl or banner material. Get custom UV printing with premium quality. Personalized gifts & home decor.",
  keywords: "acrylic photo uv print, custom UV printing, upload design online, custom acrylic print, personalized photo frame, custom name plate",
  alternates: {
    canonical: "https://www.boardvala.com/custom-design",
  },
};

export default function CustomDesignPage() {
  return (
    <Suspense>
      <CustomDesignClient />
    </Suspense>
  );
}