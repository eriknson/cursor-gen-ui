import { NextRequest, NextResponse } from "next/server";
import { fetchData, generateMockData } from "@/lib/agent-wrapper";
import { rateLimiter } from "@/lib/rate-limiter";
import type { PlanResult } from "@/lib/widget-schema";

/**
 * Dedicated refresh endpoint for live widget updates
 * Only re-runs data fetching phase - much faster than full pipeline
 * Includes rate limiting to prevent credit abuse
 */
export async function POST(request: NextRequest) {
  try {
    const { plan, query, dataMode, widgetId } = await request.json();

    // Validate required fields
    if (!plan || !query || !widgetId) {
      return NextResponse.json(
        { error: "Missing required fields: plan, query, widgetId" },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
                request.headers.get("x-real-ip") || 
                "unknown";

    // Check rate limits
    if (!rateLimiter.checkIPLimit(ip)) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: "Too many refresh requests from this IP. Limit: 100 per hour."
        },
        { status: 429 }
      );
    }

    // Check widget-specific limits
    const widgetCheck = rateLimiter.checkWidgetLimit(widgetId);
    if (!widgetCheck.allowed) {
      return NextResponse.json(
        { 
          error: "Widget refresh limit exceeded",
          message: widgetCheck.reason,
          paused: true
        },
        { status: 429 }
      );
    }

    const typedPlan = plan as PlanResult;
    const model = process.env.CURSOR_MODEL || 'cheetah';

    // Determine data mode - respect user setting or use plan's decision
    let shouldUseWebSearch = typedPlan.needsWebSearch;
    if (dataMode === 'web-search') {
      shouldUseWebSearch = true;
    } else if (dataMode === 'example-data') {
      shouldUseWebSearch = false;
    }

    // Fetch fresh data
    let dataResult;
    if (shouldUseWebSearch) {
      console.log('🔄 Refreshing with web search:', query);
      dataResult = await fetchData(typedPlan, query, model);
    } else {
      console.log('🔄 Refreshing with example data:', query);
      dataResult = await generateMockData(typedPlan, query, model);
    }

    // Add timestamp
    const refreshedAt = new Date().toISOString();

    // Return updated data with metadata
    return NextResponse.json({
      data: dataResult.data,
      source: dataResult.source,
      confidence: dataResult.confidence,
      refreshedAt,
      remainingRefreshes: rateLimiter.getRemainingRefreshes(widgetId)
    });

  } catch (error) {
    console.error("Refresh endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Refresh failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

