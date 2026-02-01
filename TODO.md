# TODO: INN-46 - Setup Package Structure

## Current Step
- [>] Install runtime dependencies (INN-47)

## Detailed Implementation Steps

### INN-46: Setup Package

- [x] Update package.json with Pi-specific metadata
  - [x] Add `"pi-package"` to keywords array
  - [x] Add `"pi"` field to package.json with extensions path
  - [x] Verify package.json structure is valid JSON

- [x] Create directory structure
  - [x] Create `extensions/` directory for auto-discovery
  - [x] Create `src/` directory for source code
  - [x] Verify directories are created

### INN-47: Install Runtime Dependencies

- [ ] Install axios (^1.4.0)
- [ ] Install node-html-parser (^7.0.1)
- [ ] Install turndown (^7.2.0)
- [ ] Install @sinclair/typebox (latest)
- [ ] Verify dependencies are installed in package.json

### INN-48: Install Dev Dependencies

- [ ] Install @types/node (^20.17.32)
- [ ] Install @types/turndown (^5.0.5)
- [ ] Verify dev dependencies are installed in package.json
- [ ] Run `npm install` to install all dependencies

### INN-49: Setup TypeScript

- [ ] Create tsconfig.json with proper configuration
  - [ ] Set compiler options: module, target, outDir, etc.
  - [ ] Configure strict mode and type checking
  - [ ] Set rootDir to src/
  - [ ] Set outDir to dist/

### INN-50: Create Extension

- [ ] Create extension entry point: `extensions/web-reader.ts`
- [ ] Set up default export function with ExtensionAPI parameter
- [ ] Add basic extension structure with comments

### INN-51: Register Tool

- [ ] Import Type from @sinclair/typebox
- [ ] Define tool schema with url parameter (string, required)
- [ ] Call pi.registerTool() with tool configuration
  - [ ] Set name: "read_website"
  - [ ] Set label and description
  - [ ] Add execute function signature

### INN-52: Implement HTTP Fetch

- [ ] Create core fetch function (adapted from fetch2md/parser.ts)
- [ ] Configure axios with:
  - [ ] Browser-like User-Agent header
  - [ ] 10 second timeout
  - [ ] HTTPS agent with rejectUnauthorized: false
- [ ] Implement try-catch error handling

### INN-53: Implement Content Type Detection

- [ ] Check response Content-Type header
- [ ] Return content as-is if text/plain or text/markdown
- [ ] Skip to Markdown detection otherwise

### INN-54: Implement Markdown Detection

- [ ] Check if response body starts with "# " (heading pattern)
- [ ] Return content as-is if it looks like Markdown
- [ ] Skip to HTML parsing otherwise

### INN-55: Implement HTML Parsing

- [ ] Parse HTML using node-html-parser
- [ ] Implement selector fallback chain:
  - [ ] Try #main-col-body
  - [ ] Try #main-content
  - [ ] Try article
  - [ ] Try main
  - [ ] Try .article
  - [ ] Try .post
  - [ ] Try .content
  - [ ] Fall back to body
- [ ] Extract innerHTML from selected element

### INN-56: Implement HTML to Markdown

- [ ] Create TurndownService instance
- [ ] Configure with:
  - [ ] headingStyle: "atx"
  - [ ] codeBlockStyle: "fenced"
- [ ] Convert HTML to Markdown

### INN-57: Implement URL Conversion

- [ ] Create convertRelativeUrls helper function
- [ ] Parse HTML and find all elements with src attributes
- [ ] Parse HTML and find all elements with href attributes
- [ ] Convert relative URLs to absolute using baseUrl
- [ ] Preserve: http://, https://, //, data:, mailto:, tel:, #
- [ ] Return modified HTML with absolute URLs

### INN-58: Implement Error Handling

- [ ] Catch and handle network errors
- [ ] Return tool error with clear failure reason
- [ ] Handle timeout errors
- [ ] Handle invalid URL errors
- [ ] Handle non-2xx HTTP responses
- [ ] Handle parse errors
- [ ] Ensure no uncaught exceptions crash the agent

### INN-59: Configure Hot Reload

- [ ] Ensure extension is in auto-discovered path (extensions/)
- [ ] Test hot reload with /reload command (document in README)

### INN-60: Add Build Script

- [ ] Verify build script in package.json: `"build": "tsc -p tsconfig.json"`
- [ ] Verify prepublishOnly script: `"prepublishOnly": "npm run build"`

### INN-63: Test Build

- [ ] Run `npm run build`
- [ ] Verify dist/index.js is created
- [ ] Verify dist/index.d.ts is created
- [ ] Verify no TypeScript compilation errors

### INN-64: Test Extension

- [ ] Test extension locally with `pi -e ./extensions/web-reader.ts`
- [ ] Test read_website tool with a simple URL (e.g., https://example.com)
- [ ] Verify tool returns Markdown content
- [ ] Test error handling with invalid URL
- [ ] Test hot reload with /reload command

### INN-61: Create README

- [ ] Update README.md with:
  - [ ] Package description and purpose
  - [ ] Installation instructions
  - [ ] Usage example for read_website tool
  - [ ] Development setup (hot reload guide)
  - [ ] Build instructions
  - [ ] Acceptance criteria reference
- [ ] Add examples of tool output

### INN-65: Verify Acceptance Criteria

- [ ] Verify extension exposes read_website tool with { url } parameter
- [ ] Test 10s timeout
- [ ] Test custom User-Agent
- [ ] Test SSL verification disabled
- [ ] Test Markdown/plain-text passthrough
- [ ] Test HTML selector fallback
- [ ] Test turndown conversion
- [ ] Test relative-to-absolute URL conversion
- [ ] Test common failure modes return clean errors
- [ ] Verify npm run build produces dist/index.js and dist/index.d.ts
- [ ] Verify published package includes dist/, README.md, LICENSE

### INN-66: Validate Non-Goals

- [ ] Verify no caching implemented
- [ ] Verify no authentication/proxy support
- [ ] Verify no multi-URL fetching or batch modes
- [ ] Verify no CLI flags or custom UI rendering
- [ ] Verify no truncation/line limits or streaming
- [ ] Verify no debug modes or environment-variable logging
- [ ] Verify no MCP server (using Pi extension API)

## Cleanup and Documentation

- [ ] Update PLAN.md with implementation notes (if needed)
- [ ] Update TASK_ORDER.md if changes to task dependencies
- [ ] Verify all TODO items checked off
- [ ] Prepare summary comment for Linear issue

## Final Verification

- [ ] Run `npm run build` - success
- [ ] All tests passing
- [ ] README is comprehensive
- [ ] Package is ready for publication
- [ ] Issue INN-46 is complete
