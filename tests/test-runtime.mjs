import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const dependency = createRequire(import.meta.url);

// Execute real application modules with isolated storage, cookies and integrations.
export function runtime({ env = {}, mocks = {}, fetch: request = async () => { throw new Error("Unexpected network request"); } } = {}) {
  const files = new Map();
  const jar = new Map();
  const cache = new Map();
  let time = Date.now();
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [time])); } static now() { return time; } }
  const cookieStore = {
    get: (name) => jar.has(name) ? { value: jar.get(name) } : undefined,
    set: (name, value, options) => options?.maxAge === 0 ? jar.delete(name) : jar.set(name, value),
    delete: (name) => jar.delete(name),
  };
  const overrides = {
    "@/lib/postgres": { isDatabaseConfigured: () => false },
    "next/headers": { cookies: async () => cookieStore },
    "next/cache": { revalidatePath() {} },
    "next/navigation": { redirect: (url) => { throw new Error(`REDIRECT:${url}`); } },
    "node:fs/promises": {
      mkdir: async () => {},
      readFile: async (path) => { if (!files.has(path)) throw new Error("ENOENT"); return files.get(path); },
      writeFile: async (path, data) => { files.set(path, data); },
    },
    ...mocks,
  };
  function load(id) {
    if (Object.hasOwn(overrides, id)) return overrides[id];
    if (!id.startsWith("@/")) return dependency(id);
    if (cache.has(id)) return cache.get(id);
    const filename = resolve("src", `${id.slice(2)}.ts`);
    const source = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    const exports = {};
    cache.set(id, exports);
    runInNewContext(source, {
      exports, require: load, Buffer, URL, URLSearchParams, Request, Response, FormData,
      setTimeout, clearTimeout, console, Date: Clock, fetch: request,
      process: { cwd: process.cwd, env: { NODE_ENV: "test", PATENTZOOM_AUTH_SECRET: "isolated-test-secret", ...env } },
    }, { filename });
    return exports;
  }
  return { load, files, jar, advance: (ms) => { time += ms; } };
}
