import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

const handler = toNextJsHandler(auth);

// Create a custom handler that adds CORS headers
async function corsHandler(request: NextRequest) {
	// Handle preflight requests
	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		});
	}

	// Call the appropriate method based on request method
	const response = await (request.method === "GET" ? handler.GET : handler.POST)(request);

	// Add CORS headers to the response
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

	return response;
}

export const GET = corsHandler;
export const POST = corsHandler;
export const OPTIONS = corsHandler;
