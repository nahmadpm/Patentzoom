import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function ProvisionalPatentPage() {
  const page = await getEditableServicePage("provisional-patent");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="provisional-patent"
    />
  );
}
