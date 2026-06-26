import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function OfficeActionResponsesPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages["office-action-responses"]}
      serviceIntent="office-action-responses"
    />
  );
}
