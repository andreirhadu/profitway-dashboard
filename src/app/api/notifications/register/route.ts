import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { deviceId, token } = await request.json()

    if (!deviceId || !token) {
      return new Response('all-fields-required', { status: 404 })
    }

    const notificationToken = await db.collection('notifications-tokens').findOne({ deviceId })

    if ( notificationToken ) {
      return Response.json({ success: true })
    }

    await db.collection('notifications-tokens').insertOne({
      deviceId,
      token
    })

    return Response.json({ success: true })
  } catch (error) {
    console.log(error)
    return new Response('something-went-wrong', { status: 400 })
  }
}