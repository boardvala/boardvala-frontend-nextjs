import { Suspense } from "react";
import ReviewClient from "./ReviewClient";
export const dynamic = "force-dynamic";

export default function ReviewPage() {
  return(
    <Suspense>
      <ReviewClient />
    </Suspense>
  ); 
}