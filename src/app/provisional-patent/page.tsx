import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function ProvisionalPatentPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages["provisional-patent"]}
      serviceIntent="provisional-patent"
    />
  );
}
