# pi-web-reader

A **pi-coding-agent** extension that fetches and extracts readable text from web pages, returning raw Markdown.

## Overview

`pi-web-reader` provides the `read_website` tool that enables LLMs to fetch web content and receive it as clean, readable Markdown. The extension handles:

- HTTP fetching with 10s timeout and browser-like User-Agent
- Automatic detection of Markdown/plain-text content
- HTML parsing with intelligent content extraction
- Conversion to Markdown using turndown
- Relative-to-absolute URL rewriting
- Comprehensive error handling

## Installation

### As a Pi Extension

1. Install the package in your Pi project:

```bash
npm install @fink-andreas/pi-web-reader
```

2. The extension will be automatically loaded by Pi if it's in your `node_modules` directory.

Pi will discover and load the extension automatically through the `pi` manifest field in `package.json`.

### Local / Development Install (dvl)

**Goal:** make the extension available in all projects by installing it under `~/.pi/agent/extensions/` as a small "package folder" with its own `node_modules`.

#### 1) Create the extension folder

```bash
mkdir -p ~/.pi/agent/extensions/web-reader
```

#### 2) Add a minimal `package.json` and install runtime deps

```bash
cd ~/.pi/agent/extensions/web-reader && printf '{\n  "name": "web-reader-extension",\n  "private": true,\n  "type": "module"\n}\n' > package.json
```

Install the dependencies the extension imports:

```bash
cd ~/.pi/agent/extensions/web-reader && npm install axios node-html-parser turndown
```

*(If pi later complains about another missing module, install it the same way in this folder.)*

#### 3) Link the extension entry file into the folder as `index.ts`

```bash
ln -sf ~/dvl/pi-web-reader/extensions/index.ts ~/.pi/agent/extensions/web-reader/index.ts
```

#### 4) Reload pi

In pi: `/reload` (or restart pi)

#### 5) Verify

In pi you should see something like:

* `[Extensions] … ~/.pi/agent/extensions/web-reader/index.ts`
  and **no** `[Extension issues]`.

## Usage

### Using the Tool

The `read_website` tool accepts a single parameter: `url`

```typescript
// Example: Fetch a website
{
  "tool": "read_website",
  "parameters": {
    "url": "https://example.com"
  }
}
```

**Response:**

The tool returns raw Markdown representing the main readable content of the website:

```markdown
# Example Domain

This domain is for use in documentation examples without needing permission. Avoid use in operations.

[Learn more](https://iana.org/domains/example)
```

### Tool Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `url`     | string | Yes      | The URL of the website to fetch and convert to Markdown |

## Features

### Content Type Detection

- **Text/Markdown**: If the response `Content-Type` is `text/plain` or `text/markdown`, content is returned as-is
- **Markdown Detection**: If the body contains Markdown headings (e.g., `# Heading`), content is returned as-is
- **HTML Parsing**: For HTML content, the main readable content is extracted and converted to Markdown

### HTML Extraction Strategy

The extension uses a fallback selector chain to extract the main content:

1. `#main-col-body`
2. `#main-content`
3. `article`
4. `main`
5. `.article`
6. `.post`
7. `.content`
8. `body` (fallback)

### URL Handling

- All relative `src` and `href` attributes are converted to absolute URLs
- Special schemes are preserved: `http://`, `https://`, `//`, `data:`, `mailto:`, `tel:`, `#`

### Error Handling

The extension returns clear error messages for common failure modes:

- **Timeout**: "Request timeout after 10 seconds"
- **Network Error**: "Network error - no response received"
- **Invalid URL**: "Invalid URL"
- **HTTP Errors**: "HTTP {status_code}"

## Development

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript and generates type definitions in the `dist/` directory.

### Hot Reload During Development

The extension is configured for hot reload support:

1. **Extension Location**: `extensions/index.ts` (auto-discovered path)
2. **Pi Manifest**: The `package.json` includes a `pi.extensions` field pointing to the `extensions` directory

To reload the extension after making changes:

```bash
# While Pi is running, use the reload command
/reload
```

This reloads all extensions without restarting the Pi agent.

### Running Tests

```bash
node test-extension.js
```

This runs a suite of tests to verify:
- HTTP fetching functionality
- Content type detection
- HTML parsing and Markdown conversion
- Error handling

## Configuration

### Package Structure

```
pi-web-reader/
├── extensions/
│   └── index.ts          # Main extension implementation
├── src/
│   └── index.ts          # Package main export
├── dist/                 # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### TypeScript Configuration

The project uses TypeScript with ES2022 target and strict type checking. See `tsconfig.json` for full configuration.

## API Reference

### `read_website` Tool

Fetches a website URL and returns raw Markdown.

**Parameters:**
- `url` (string, required) - The URL to fetch

**Returns:**
- `content` - Array containing the Markdown text
- `details` - Optional metadata including content type and conversion info
- `isError` - Boolean flag indicating if an error occurred

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "# Example Domain\n\nThis domain is for use in documentation examples..."
    }
  ],
  "details": {
    "contentType": "text/html",
    "converted": true
  }
}
```

## Dependencies

- **axios** - HTTP client for fetching web content
- **node-html-parser** - HTML parsing and content extraction
- **turndown** - HTML to Markdown conversion
- **@sinclair/typebox** - Tool parameter schema definitions
- **@mariozechner/pi-coding-agent** - Pi extension API

## License

MIT

## Repository

https://github.com/fink-andreas/pi-web-reader

## Acceptance Criteria

The extension meets the following acceptance criteria:

- ✅ Exposes `read_website` tool that accepts `{ url }` parameter
- ✅ Returns raw Markdown without truncation or metadata summaries
- ✅ HTTP fetch with 10s timeout, custom User-Agent, SSL verification disabled
- ✅ Markdown/plain-text passthrough for appropriate content types
- ✅ HTML selector fallback chain for content extraction
- ✅ Turndown conversion for HTML content
- ✅ Relative-to-absolute URL rewriting
- ✅ Clean error results for all failure modes
- ✅ `npm run build` produces `dist/extensions/index.js` and type definitions
- ✅ Published package includes `dist/`, `README.md`, `LICENSE`

## Non-Goals

The following features are explicitly out of scope:

- ❌ No caching
- ❌ No authentication or proxy support
- ❌ No multi-URL fetching or batch modes
- ❌ No CLI flags or custom UI rendering
- ❌ No truncation/line limits or streaming output
- ❌ No debug modes or environment-variable controlled logging
- ❌ No MCP server (uses Pi extension API instead)

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass: `node test-extension.js`
2. Code builds successfully: `npm run build`
3. Type definitions are generated: Check `dist/` directory
4. Documentation is updated if needed

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/fink-andreas/pi-web-reader/issues