import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function PctInternationalPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages["pct-international"]}
      serviceIntent="pct-international"
    />
  );
}
