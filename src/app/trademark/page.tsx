import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function TrademarkPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages.trademark}
      serviceIntent="trademark"
    />
  );
}
