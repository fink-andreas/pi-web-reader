/**
 * Simple test script for pi-web-reader extension
 * Tests the core functionality without needing to run the full Pi agent
 */

import axios from "axios";
import https from "https";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

// Configuration constants
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const TIMEOUT_MS = 10_000;

// HTTPS agent with SSL verification disabled
const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
});

/**
 * Fetch a URL with the specified configuration
 */
async function fetchUrl(url) {
	try {
		const response = await axios(url, {
			method: "GET",
			timeout: TIMEOUT_MS,
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			},
			httpsAgent,
		});

		if (response.status < 200 || response.status >= 300) {
			throw new Error(`HTTP ${response.status}`);
		}

		return {
			body: response.data,
			contentType: (response.headers["content-type"]) || "",
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
 * Check if content looks like markdown
 */
function looksLikeMarkdown(body) {
	if (!body || body.trim().length === 0) {
		return false;
	}

	const trimmedBody = body.trim();

	// Check for ATX headings: # heading
	const atxHeadingRegex = /^#{1,6}\s+/m;
	if (atxHeadingRegex.test(trimmedBody)) {
		return true;
	}

	return false;
}

/**
 * Extract main content from HTML using fallback selectors
 */
function extractMainContent(html) {
	const root = parse(html);

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

	return html;
}

/**
 * Convert HTML to Markdown using turndown
 */
function htmlToMarkdown(html) {
	const turndownService = new TurndownService({
		headingStyle: "atx",
		codeBlockStyle: "fenced",
	});

	return turndownService.turndown(html);
}

/**
 * Test function
 */
async function testExtension() {
	console.log("🧪 Testing pi-web-reader extension...\n");

	// Test 1: Fetch a simple website (example.com)
	try {
		console.log("Test 1: Fetching example.com...");
		const result = await fetchUrl("https://example.com");
		console.log(`  ✅ Fetch successful, content-type: ${result.contentType}`);
		console.log(`  ✅ Body length: ${result.body.length} characters`);

		// Test content type detection
		const isMarkdown = looksLikeMarkdown(result.body);
		console.log(`  ✅ Markdown detection: ${isMarkdown}`);

		// Test HTML parsing
		const mainContent = extractMainContent(result.body);
		console.log(`  ✅ Main content extracted: ${mainContent.length} characters`);

		// Test Markdown conversion
		const markdown = htmlToMarkdown(mainContent);
		console.log(`  ✅ Markdown conversion: ${markdown.length} characters`);

		// Show a preview
		console.log("\n  Markdown preview:");
		console.log("  " + markdown.split("\n").slice(0, 5).join("\n  "));
		console.log("  ...");
	} catch (error) {
		console.log(`  ❌ Test failed: ${error.message}`);
		return false;
	}

	// Test 2: Error handling - invalid URL
	try {
		console.log("\nTest 2: Testing error handling (invalid URL)...");
		await fetchUrl("not-a-valid-url");
		console.log("  ❌ Should have thrown an error");
		return false;
	} catch (error) {
		console.log(`  ✅ Error correctly caught: ${error.message}`);
	}

	// Test 3: Error handling - non-existent domain
	try {
		console.log("\nTest 3: Testing error handling (non-existent domain)...");
		await fetchUrl("https://this-domain-does-not-exist-12345.com");
		console.log("  ❌ Should have thrown an error");
		return false;
	} catch (error) {
		console.log(`  ✅ Error correctly caught: ${error.message}`);
	}

	console.log("\n✅ All tests passed!");
	return true;
}

// Run tests
testExtension().catch((error) => {
	console.error("❌ Test suite failed:", error);
	process.exit(1);
});