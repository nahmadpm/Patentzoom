import { KnowledgeCenterPage } from "@/components/knowledge-center-page";
import { listPublishedArticles } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const articles = await listPublishedArticles();
  return <KnowledgeCenterPage articles={articles} />;
}
