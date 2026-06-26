import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function UtilityPatentPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages["utility-patent"]}
      serviceIntent="utility-patent"
    />
  );
}
