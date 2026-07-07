import { ReferenceServicePage } from "@/components/reference-service-page";
import { getEditableServicePage } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function IpPortfolioStrategyPage() {
  const page = await getEditableServicePage("ip-portfolio-strategy");

  return (
    <ReferenceServicePage
      page={page}
      serviceIntent="ip-portfolio-strategy"
    />
  );
}
