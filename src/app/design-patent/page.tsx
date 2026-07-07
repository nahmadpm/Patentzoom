import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function DesignPatentPage() {
  const page = await getEditableServicePage("design-patent");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="design-patent"
    />
  );
}
