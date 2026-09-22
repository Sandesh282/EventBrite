/**
 * app/api/events/[slug]/route.ts
 *
 * GET /api/events/:slug — single event with all relations joined.
 *
 * Handler delegates to the service layer.
 * The join query (events → categories, venues, images) lives in:
 *   lib/repositories/events.repo.ts → findBySlug()
 */

import { NextRequest, NextResponse } from "next/server"
import * as eventsService from "@/lib/services/events.service"

type RouteParams = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { slug } = await params

  const event = await eventsService.getEvent(slug)

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  return NextResponse.json({ data: event })
}
