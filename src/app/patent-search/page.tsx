import { PatentSearchPage } from "@/components/patent-search-page";
import { getEditablePatentSearchPackages } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <PatentSearchPage packages={await getEditablePatentSearchPackages()} />;
}
