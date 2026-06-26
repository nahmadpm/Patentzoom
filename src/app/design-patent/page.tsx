import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function DesignPatentPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages["design-patent"]}
      serviceIntent="design-patent"
    />
  );
}
