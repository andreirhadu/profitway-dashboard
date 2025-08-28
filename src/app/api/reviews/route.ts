import { auth } from "@/auth"
import { db } from "@/lib/db"

export const GET = auth(async function Post(request) {
  try {
    const reviews = await db.collection('reviews').find({}).toArray()

    return Response.json({ reviews })
  } catch (e) {
    console.log(e)
    return new Response('something-went-wrong', { status: 400 })
  }
}) as any

export const POST = auth(async function Post(request) {
  if (!request.auth) {
    return new Response("Not authenticated", { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return new Response("Missing id", { status: 400 })
    }

    await db.collection("reviews").insertOne({ id })
    return new Response("Review added", { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response("something-went-wrong", { status: 400 })
  }
}) as any

export const DELETE = auth(async function Delete(request) {
  if (!request.auth) {
    return new Response("Not authenticated", { status: 401 })
  }

  try {
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return new Response("Missing id", { status: 400 })
    }

    await db.collection("reviews").deleteOne({ id })
    return new Response("Review deleted", { status: 200 })
  } catch (e) {
    console.log(e)
    return new Response("something-went-wrong", { status: 400 })
  }
}) as any