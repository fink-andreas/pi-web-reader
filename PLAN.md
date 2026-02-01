# PLAN: INN-46 - Setup Package Structure for @fink-andreas/pi-web-reader

## Project Overview

Convert the existing `fetch2md-mcp-server` into a Pi extension package that provides a `read_website` tool for fetching and converting web pages to Markdown.

## Current Project State

### Directory Structure
```
.
├── AGENTS.md              # Agent configuration
├── LICENSE                # MIT license
├── package.json           # Basic npm package configuration (exists)
├── PRD.md                 # Product requirements document
├── README.md              # Basic readme
└── TASK_ORDER.md          # Task dependency tree
```

### Existing Files Analysis

#### package.json
Current state contains:
- ✅ `name`: `@fink-andreas/pi-web-reader`
- ✅ `version`: `0.1.0`
- ✅ `description`: Basic description
- ✅ `license`: MIT
- ✅ `repository`: GitHub repository info
- ✅ `bugs`: GitHub issues URL
- ✅ `homepage`: GitHub homepage
- ✅ `keywords`: `["pi-package", "pi-coding-agent", "pi", "extension"]`
- ✅ `type`: `module`
- ✅ `main`: `dist/index.js`
- ✅ `types`: `dist/index.d.ts`
- ✅ `files`: `["dist", "README.md", "LICENSE"]`
- ✅ `scripts`: `build` and `prepublishOnly`
- ✅ `devDependencies`: TypeScript

**Missing for Pi package:**
- ❌ `"pi"` manifest field for extension discovery
- ❌ `"pi-package"` in keywords for discoverability

#### Reference Implementation: ~/dvl/fetch2md
Contains the core logic we need to adapt:
- `src/index.ts` - MCP server (NOT used - we need Pi extension instead)
- `src/parser.ts` - Core fetch and convert logic (USED as reference)
- `src/debug.ts` - Debug utilities (NOT used per PRD non-goals)

Key dependencies from reference:
- `axios` - HTTP client
- `node-html-parser` - HTML parsing
- `turndown` - HTML to Markdown conversion
- `@sinclair/typebox` - Schema definitions (for Pi tools)

## Implementation Strategy

### Phase 1: Package Setup (INN-46)
**Goal**: Initialize npm package as a proper Pi package

Tasks:
1. Update package.json with Pi-specific metadata
2. Create directory structure for extensions

### Phase 2: Dependencies (INN-47, INN-48)
**Goal**: Install required dependencies

Tasks:
1. Install runtime dependencies (axios, node-html-parser, turndown, @sinclair/typebox)
2. Install dev dependencies (TypeScript types)

### Phase 3: TypeScript Setup (INN-49, INN-60, INN-63)
**Goal**: Configure TypeScript build system

Tasks:
1. Create tsconfig.json
2. Ensure build script works correctly

### Phase 4: Extension Implementation (INN-50 - INN-58)
**Goal**: Implement the Pi extension with read_website tool

Tasks:
1. Create extension entry point
2. Register the read_website tool with TypeBox schema
3. Implement HTTP fetching
4. Implement content type detection
5. Implement HTML parsing and Markdown conversion
6. Implement URL conversion
7. Implement error handling

### Phase 5: Hot Reload & Testing (INN-59, INN-64, INN-61, INN-65, INN-66)
**Goal**: Ensure development workflow works and acceptance criteria are met

Tasks:
1. Configure hot reload support
2. Test the extension
3. Create comprehensive README
4. Verify acceptance criteria
5. Validate non-goals

## High-Level TODO List

1. [ ] Update package.json with Pi-specific metadata (`pi` field, `pi-package` keyword)
2. [ ] Create directory structure (extensions/, src/)
3. [ ] Create tsconfig.json for TypeScript compilation
4. [ ] Install runtime dependencies (axios, node-html-parser, turndown, @sinclair/typebox)
5. [ ] Install dev dependencies (@types/node, @types/turndown)
6. [ ] Create extension entry point in extensions/web-reader.ts
7. [ ] Implement core fetch logic (adapted from fetch2md/parser.ts)
8. [ ] Register read_website tool with TypeBox schema
9. [ ] Implement content type and Markdown detection
10. [ ] Implement HTML parsing with selector fallbacks
11. [ ] Implement relative to absolute URL conversion
12. [ ] Implement error handling
13. [ ] Test build produces dist/index.js
14. [ ] Test extension with pi -e
15. [ ] Update README with usage instructions and hot reload guide
16. [ ] Verify all acceptance criteria are met
17. [ ] Validate non-goals (no debug, no MCP, etc.)

## Dependencies Reference (from fetch2md)

Runtime:
- `axios` ^1.4.0 - HTTP client
- `node-html-parser` ^7.0.1 - HTML parsing
- `turndown` ^7.2.0 - HTML to Markdown
- `@sinclair/typebox` - Tool parameter schemas (for Pi)

Dev:
- `typescript` ^5.5.0 - TypeScript compiler
- `@types/node` ^20.17.32 - Node.js types
- `@types/turndown` ^5.0.5 - Turndown types

## Pi Extension Requirements

Based on Pi documentation:

1. **Extension location**: `extensions/*.ts` or `extensions/*/index.ts` for auto-discovery
2. **Package manifest**: Add `pi` field to package.json:
   ```json
   {
     "pi": {
       "extensions": ["extensions"]
     }
   }
   ```
3. **Keywords**: Add `"pi-package"` for discoverability
4. **Entry point**: Default export function receiving `ExtensionAPI`
5. **Tool registration**: Use `pi.registerTool()` with TypeBox schemas
6. **Hot reload**: Extensions in auto-discovered paths support `/reload` command

## Acceptance Criteria Summary

From PRD:
- ✅ Extension exposes `read_website` tool accepting `{ url }`
- ✅ Fetch behavior: 10s timeout, custom UA, SSL verification disabled
- ✅ Returns raw Markdown only (no truncation, no metadata summaries)
- ✅ Markdown/plain-text passthrough for text/markdown content
- ✅ HTML selector fallback + turndown conversion
- ✅ Relative-to-absolute URL rewriting
- ✅ Clean error results on failures (no crashes)
- ✅ `npm run build` produces dist/index.js and dist/index.d.ts
- ✅ Published package includes dist/, README.md, LICENSE

## Non-Goals (Out of Scope)

- No caching, authentication, proxy support
- No multi-URL fetching or batch modes
- No CLI flags or custom UI rendering
- No truncation/line limits or streaming
- No debug modes or environment-variable logging
- No MCP server (use Pi extension API instead)
