/**
 * Pi Web Reader Extension
 *
 * Fetches and extracts readable text from web pages, returning raw Markdown.
 *
 * Provides the `read_website` tool for LLMs to fetch web content.
 */

import axios from "axios";
import https from "https";
import { parse } from "node-html-parser";
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
 * Interface for fetch result
 */
interface FetchResult {
	body: string;
	contentType: string;
}

/**
 * Fetch a URL with the specified configuration
 *
 * @param url - The URL to fetch
 * @returns The response body and content type
 * @throws Error if the fetch fails
 */
async function fetchUrl(url: string): Promise<FetchResult> {
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

		return {
			body: response.data as string,
			contentType: (response.headers["content-type"] as string) || "",
		};
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
 * Check if content type indicates plain text or markdown
 *
 * @param contentType - The Content-Type header value
 * @returns True if the content type is text/plain or text/markdown
 */
function isTextOrMarkdown(contentType: string): boolean {
	const normalizedType = contentType.toLowerCase().trim();
	return (
		normalizedType.startsWith("text/plain") ||
		normalizedType.startsWith("text/markdown")
	);
}

/**
 * Check if content looks like markdown
 *
 * Checks for common markdown patterns:
 * - ATX headings (#, ##, etc.)
 * - Setext headings (=== or --- on next line)
 *
 * @param body - The content to check
 * @returns True if the content appears to be markdown
 */
function looksLikeMarkdown(body: string): boolean {
	if (!body || body.trim().length === 0) {
		return false;
	}

	const trimmedBody = body.trim();

	// Check for ATX headings: # heading
	const atxHeadingRegex = /^#{1,6}\s+/m;
	if (atxHeadingRegex.test(trimmedBody)) {
		return true;
	}

	// Check for Setext headings: === or --- on the next line after some text
	const lines = trimmedBody.split("\n");
	for (let i = 0; i < lines.length - 1; i++) {
		const line = lines[i].trim();
		const nextLine = lines[i + 1].trim();

		// Need non-empty line followed by only === or ---
		if (line.length > 0) {
			if (/^={3,}$/.test(nextLine) || /^-{3,}$/.test(nextLine)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Extract main content from HTML using fallback selectors
 *
 * Tries selectors in order until a match is found:
 * 1. #main-col-body
 * 2. #main-content
 * 3. article
 * 4. main
 * 5. .article, .post, .content
 * 6. body (fallback)
 *
 * @param html - The HTML content to parse
 * @returns The extracted main content as HTML string
 */
function extractMainContent(html: string): string {
	const root = parse(html);

	// Try selectors in order
	const selectors = [
		"#main-col-body",
		"#main-content",
		"article",
		"main",
		".article",
		".post",
		".content",
		"body",
	];

	for (const selector of selectors) {
		const element = root.querySelector(selector);
		if (element) {
			return element.outerHTML;
		}
	}

	// If nothing found, return the full HTML
	return html;
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
			// INN-53: Content-Type detection (text/plain, text/markdown, markdown detection) ✓ DONE
			// INN-54: Markdown detection (body starts with # heading) ✓ DONE
			// INN-55: HTML parsing with fallback selectors ✓ DONE
			// INN-56: HTML to Markdown conversion using turndown
			// INN-57: Relative URL to absolute URL conversion
			// INN-58: Error handling

			// Step 1: Fetch the URL
			const { body, contentType } = await fetchUrl(url);

			// Step 2: Check if content type is text/plain or text/markdown
			if (isTextOrMarkdown(contentType)) {
				return {
					content: [{ type: "text", text: body }],
					details: { contentType },
				};
			}

			// Step 3: Check if body looks like markdown
			if (looksLikeMarkdown(body)) {
				return {
					content: [{ type: "text", text: body }],
					details: { contentType, detected: "markdown" },
				};
			}

			// Step 4: Extract main content from HTML
			const mainContent = extractMainContent(body);

			// Step 5: Convert to Markdown and process URLs (INN-56, INN-57)
			// Placeholder - subsequent issues will add HTML-to-Markdown conversion and URL conversion
			throw new Error("HTML parsing implemented, pending Markdown conversion and URL conversion (INN-56, INN-57)");
		},
	});
}
