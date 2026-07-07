import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function TrademarkPage() {
  const page = await getEditableServicePage("trademark");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="trademark"
    />
  );
}
