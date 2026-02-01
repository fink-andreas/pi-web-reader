/**
 * Pi Web Reader Extension
 *
 * Fetches and extracts readable text from web pages, returning raw Markdown.
 *
 * Provides the `read_website` tool for LLMs to fetch web content.
 */

import axios from "axios";
import https from "https";
import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

/**
 * Tool parameters for read_website
 */
const ReadWebsiteParams = Type.Object({
	url: Type.String({ description: "The URL of the website to fetch and convert to Markdown" }),
});

/**
 * HTTP fetch configuration
 */
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TIMEOUT_MS = 10_000; // 10 seconds

/**
 * HTTPS agent with SSL verification disabled to accept self-signed certificates
 */
const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
});

/**
 * Fetch a URL with the specified configuration
 *
 * @param url - The URL to fetch
 * @returns The response body as a string
 * @throws Error if the fetch fails
 */
async function fetchUrl(url: string): Promise<string> {
	try {
		const response = await axios(url, {
			method: "GET",
			timeout: TIMEOUT_MS,
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			},
			// Disable SSL verification to accept self-signed certificates
			httpsAgent,
		});

		// Axios automatically follows redirects, so we get the final response
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`HTTP ${response.status}`);
		}

		return response.data as string;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.code === "ECONNABORTED") {
				throw new Error("Request timeout after 10 seconds");
			}
			if (error.response) {
				throw new Error(`HTTP ${error.response.status}`);
			}
			if (error.request) {
				throw new Error("Network error - no response received");
			}
		}
		throw error;
	}
}

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
			// INN-52: HTTP fetch with timeout, custom User-Agent, SSL verification disabled ✓ DONE
			// INN-53: Content-Type detection (text/plain, text/markdown, markdown detection)
			// INN-54: Markdown detection (body starts with # heading)
			// INN-55: HTML parsing with fallback selectors
			// INN-56: HTML to Markdown conversion using turndown
			// INN-57: Relative URL to absolute URL conversion
			// INN-58: Error handling

			// Step 1: Fetch the URL
			const body = await fetchUrl(url);

			// Placeholder - subsequent issues will add processing
			throw new Error("HTTP fetch implemented, pending content processing (INN-53 through INN-57)");
		},
	});
}
