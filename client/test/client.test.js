import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

test("client has chat entrypoint and API proxy configured", () => {
  assert.equal(existsSync(new URL("../src/App.jsx", import.meta.url)), true);
  const viteConfig = readFileSync(new URL("../vite.config.js", import.meta.url), "utf8");

  assert.match(viteConfig, /localhost:3000/);
  assert.match(viteConfig, /'\/api'/);
});
