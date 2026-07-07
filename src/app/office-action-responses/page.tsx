import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function OfficeActionResponsesPage() {
  const page = await getEditableServicePage("office-action-responses");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="office-action-responses"
    />
  );
}
