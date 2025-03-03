import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  return Response.json({ key: process.env.STRIPE_PUBLISHABLE_KEY })
}