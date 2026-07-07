import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function UtilityPatentPage() {
  const page = await getEditableServicePage("utility-patent");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="utility-patent"
    />
  );
}
