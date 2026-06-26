import { ReferenceServicePage } from "@/components/reference-service-page";
import { referenceServicePages } from "@/lib/site-data";

export default function IpPortfolioStrategyPage() {
  return (
    <ReferenceServicePage
      page={referenceServicePages["ip-portfolio-strategy"]}
      serviceIntent="ip-portfolio-strategy"
    />
  );
}
