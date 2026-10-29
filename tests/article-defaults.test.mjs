import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const loadDependency = createRequire(import.meta.url);
const filename = fileURLToPath(new URL("../src/lib/admin-content.ts", import.meta.url));
const source = ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function contentStore(articles = []) {
  const exports = {};
  runInNewContext(source, {
    exports,
    process,
    require(name) {
      if (name === "@/lib/site-data") return { referenceServicePages: {} };
      if (name === "@/lib/postgres") return { isDatabaseConfigured: () => false };
      if (name === "node:fs/promises") {
        return {
          mkdir: async () => {},
          readFile: async () => JSON.stringify({ pricing: [], articles }),
          writeFile: async () => { throw new Error("Reading articles must not change the store."); },
        };
      }
      return loadDependency(name);
    },
  }, { filename });
  return exports;
}

test("empty store retains all three original published articles", async () => {
  assert.equal((await contentStore().listPublishedArticles()).length, 3);
});

test("first automated publication keeps original articles and URLs", async () => {
  const defaults = await contentStore().listArticles();
  const newArticle = {
    ...defaults[0], id: "automated-article", slug: "new-automated-article",
    publishedAt: "2026-10-29T13:00:00.000Z",
  };
  const store = contentStore([newArticle]);
  const articles = await store.listPublishedArticles();
  assert.equal(articles.length, 4);
  assert.equal(articles[0].id, newArticle.id);
  for (const original of defaults) {
    assert.equal((await store.getArticleBySlug(original.slug)).body, original.body);
  }
});

test("an edited original takes precedence without duplication", async () => {
  const [original] = await contentStore().listArticles();
  const store = contentStore([{ ...original, title: "Edited original", slug: "renamed-original" }]);
  assert.equal((await store.listArticles()).length, 3);
  assert.equal(await store.getArticleBySlug(original.slug), null);
  assert.equal((await store.getArticleById(original.id)).title, "Edited original");
});

test("a saved draft suppresses the matching published default", async () => {
  const [original] = await contentStore().listArticles();
  const store = contentStore([{ ...original, status: "draft" }]);
  assert.equal((await store.listPublishedArticles()).length, 2);
  assert.equal((await store.getArticleBySlug(original.slug)).status, "draft");
});

test("matching slugs do not produce duplicate articles with different IDs", async () => {
  const [original] = await contentStore().listArticles();
  const store = contentStore([{ ...original, id: "imported-original" }]);
  assert.equal((await store.listArticles()).length, 3);
  assert.equal((await store.getArticleBySlug(original.slug)).id, "imported-original");
});
