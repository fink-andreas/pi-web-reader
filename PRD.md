Convert the existing `fetch2md-mcp-server` (source code available in ~/dvl/fetch2md) logic into a **Pi (pi-coding-agent) extension** inside a **separate npm repo/package** whose `package.json` is already defined as:

* `name`: `@fink-andreas/pi-web-reader`
* `main`: `dist/index.js`
* `types`: `dist/index.d.ts`
* `files`: includes `dist`, `README.md`, `LICENSE`
* `build`: `tsc -p tsconfig.json`

### Primary Goal

Implement a Pi extension tool named **`read_website`** that:

1. fetches the given website URL, and
2. returns **raw Markdown** representing the main readable content.

### Scope & Constraints

* **No MCP server**: do not use `@modelcontextprotocol/sdk`, zod schemas, stdio, or any MCP-specific server wrapper.
* **No debug support** (no `DEBUG` env var and no `debug` tool parameter).
* **Return raw markdown only** (do not add truncation messages, metadata summaries, progress text, or UI wrappers in the returned markdown).
* **Keep SSL verification disabled** (accept self-signed certificates) for HTTPS fetches.
* Repo remains a standalone publishable npm package (`@fink-andreas/pi-web-reader`); keep existing package identity and metadata.

### Required Tool Contract

Tool name: `read_website`

Parameters:

* `url: string` (required)

Behavior:

1. **HTTP Fetching**

   * Use axios (or the repo’s chosen HTTP client if already present, but prefer axios to match the original behavior).
   * Set a browser-like `User-Agent`.
   * Timeout: **10 seconds**.
   * HTTPS: disable certificate verification (`rejectUnauthorized: false`).

2. **Content-Type / Markdown detection**

   * If response `Content-Type` is `text/plain` or `text/markdown`, treat body as already-markdown/plain text and return it as-is.
   * If the body is a string that “looks like markdown” (e.g., contains a Markdown heading like `# `), return it as-is.

3. **HTML Parsing → Markdown**

   * Parse HTML using `node-html-parser`.
   * Identify the “main content” by trying the same fallback selectors (in order) as the original project:

     * `#main-col-body`
     * `#main-content`
     * `article`
     * `main`
     * `.article`, `.post`, `.content`
     * `body` (fallback)
   * Convert HTML to Markdown using `turndown`:

     * ATX headings (`#`)
     * fenced code blocks

4. **Relative URL handling**

   * Convert relative `src` and `href` values to absolute URLs based on the fetched page URL.
   * Preserve links that are already absolute or special schemes and anchors, including:

     * `http://`, `https://`, `//` (protocol-relative)
     * `data:`, `mailto:`, `tel:`
     * `#` anchors

5. **Error handling**

   * On failure (network error, timeout, invalid URL, non-2xx response, parse error), return a tool error result that clearly states the failure reason (e.g., `HTTP <status>` or the thrown error message). Do not crash the agent process.

### Packaging & Pi Integration Requirements

* Implement as a **Pi extension** using the pi-coding-agent extension API (`ExtensionAPI`) and `pi.registerTool(...)`.
* Define tool parameters using **TypeBox** schemas (`@sinclair/typebox`) consistent with Pi tooling conventions.
* Update `package.json` only as necessary to:

  * add required runtime dependencies (`axios`, `node-html-parser`, `turndown`, `@sinclair/typebox`)
  * add required peer/dev dependencies for Pi extension development (e.g., `@mariozechner/pi-coding-agent` as appropriate for an extension package)
  * add a `pi` field that declares the extension entry file(s), OR place the extension in an auto-discovered location (see hot reload below). The `pi` field supports listing extension paths. ([GitHub][1])

### Development Workflow: Hot Reload Best Practice

Set the repo up so extension changes can be reloaded quickly during development:

* Prefer putting the extension entrypoint in an **auto-discovered extensions path** such as `extensions/*.ts` or `extensions/*/index.ts`, which is recognized by Pi’s package/discovery conventions. ([GitHub][1])
* Ensure the workflow supports **manual reload via `/reload`** while Pi is running. ([GitHub][2])

  * Document in the repo README how to run Pi with the local extension and reload it after edits.

### Acceptance Criteria (Definition of Done)

* Running Pi with this extension loaded exposes a callable tool named `read_website` that accepts `{ url }` and returns Markdown text.
* Fetch behavior matches the original MCP server’s key behavior:

  * 10s timeout, custom UA, SSL verification disabled
  * markdown/plain-text passthrough
  * HTML selector fallback + turndown conversion
  * relative-to-absolute URL rewriting for `href` and `src`
* Common failure modes return a clean error result (no uncaught exceptions).
* `npm run build` produces `dist/index.js` and `dist/index.d.ts`, and the published package includes the compiled `dist/` artifacts per the existing `files` configuration.

### Non-Goals (Explicitly Out of Scope)

* Adding caching, authentication, proxy support, multi-URL fetching, batch modes, or additional tools.
* Adding CLI flags or custom UI rendering.
* Adding truncation/line limits or progressive streaming output.
* Adding debug modes or environment-variable-controlled logging.

### Summary of what was improved (why this prompt is clearer)

* Narrowed the task to a single deliverable: one Pi extension tool (`read_website`) that returns raw markdown.
* Converted earlier “plan + sample code” into explicit, testable requirements (timeout, SSL behavior, selectors, conversion rules, error handling).
* Removed ambiguity around debug/truncation/UI by stating them as non-goals.
* Clarified packaging expectations (keep `@fink-andreas/pi-web-reader`, build to `dist/`, declare extension paths) and added concrete hot-reload expectations via auto-discovery + `/reload`. ([GitHub][1])

Assumptions (only if made):

* A1: Pi can load extensions from TypeScript source paths in auto-discovered `extensions/*.ts` locations and supports manual reload via `/reload`. ([GitHub][1])

Open Questions (only if minor non-blocking remain):

* Q1: None.

[1]: https://github.com/badlogic/pi-mono/issues/645 "Extension package management and hot reload · Issue #645 · badlogic/pi-mono · GitHub"
[2]: https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md?utm_source=chatgpt.com "pi-mono/packages/coding-agent/README.md at main"
