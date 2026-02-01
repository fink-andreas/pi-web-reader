/**
 * Pi Web Reader Extension
 *
 * Fetches and extracts readable text from web pages, returning raw Markdown.
 *
 * Provides the `read_website` tool for LLMs to fetch web content.
 */

import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

/**
 * Tool parameters for read_website
 */
const ReadWebsiteParams = Type.Object({
	url: Type.String({ description: "The URL of the website to fetch and convert to Markdown" }),
});

/**
 * Tool definition for read_website
 */
export default function webReaderExtension(pi: ExtensionAPI) {
	pi.registerTool({
		name: "read_website",
		label: "Read Website",
		description: "Fetch a website URL and return raw Markdown representing the main readable content",
		parameters: ReadWebsiteParams,

		async execute(toolCallId, params, _onUpdate, _ctx, _signal) {
			const { url } = params as { url: string };

			// Implementation steps (to be done in subsequent issues):
			// INN-52: HTTP fetch with timeout, custom User-Agent, SSL verification disabled
			// INN-53: Content-Type detection (text/plain, text/markdown, markdown detection)
			// INN-54: Markdown detection (body starts with # heading)
			// INN-55: HTML parsing with fallback selectors
			// INN-56: HTML to Markdown conversion using turndown
			// INN-57: Relative URL to absolute URL conversion
			// INN-58: Error handling

			// Placeholder implementation - to be replaced in INN-52
			throw new Error("read_website tool implementation pending - see issues INN-52 through INN-58");
		},
	});
}
