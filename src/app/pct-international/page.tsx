import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function PctInternationalPage() {
  const page = await getEditableServicePage("pct-international");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="pct-international"
    />
  );
}
