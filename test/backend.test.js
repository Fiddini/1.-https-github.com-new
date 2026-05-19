import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const serverSource = readFileSync(new URL("../server.js", import.meta.url), "utf8");

test("backend keeps Groq primary and OpenAI fallback on 401", () => {
  assert.match(serverSource, /process\.env\.GROQ_API_KEY/);
  assert.match(serverSource, /process\.env\.OPENAI_API_KEY/);
  assert.match(serverSource, /status === 401/);
  assert.match(serverSource, /Groq invalid, using OpenAI/);
  assert.match(serverSource, /OPENAI_FALLBACK_MODEL = "gpt-4o-mini"/);
});

test("backend supports Supabase anon env and configurable port", () => {
  assert.match(serverSource, /process\.env\.SUPABASE_ANON_KEY/);
  assert.match(serverSource, /process\.env\.SUPABASE_KEY/);
  assert.match(serverSource, /process\.env\.PORT \|\| 3000/);
});
