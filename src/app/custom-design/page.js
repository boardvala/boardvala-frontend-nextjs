import { Suspense } from "react";
import CustomDesignClient from "./CustomDesignClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upload Your Design — Custom UV Printing | BoardVala",
  description:
    "Upload your own design, photo or artwork. Choose material and size. We UV-print it on acrylic, MDF, sunboard or banner. Delivered across India.",
};

export default function CustomDesignPage() {
  return (
    <Suspense>
      <CustomDesignClient />
    </Suspense>
  );
}