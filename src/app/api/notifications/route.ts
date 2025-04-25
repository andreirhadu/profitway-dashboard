import { auth } from "@/auth";
import { db } from "@/lib/db";
import axios from "axios";

const sendNotification = async (pushToken: string, title: string, body: string) => {
  return axios.post("https://exp.host/--/api/v2/push/send", {
    to: pushToken,
    title: title,
    body: body,
  }, {
    headers: {
      "Accept": "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
  })
}

export const POST = auth(async function Post(request) {
  if ( !request.auth ) {
    return new Response("Not authenticated", {status: 401})
  }

  try {
    const pushTokens = await db.collection('notifications-tokens').find({}).toArray()
    const { title, content } = await request.json()

    const promises = pushTokens.map((token) => {
      return sendNotification(token.token, title, content)
    })

    await Promise.all(promises)

    return Response.json({ success: true })
  } catch (e) {
    console.log(e)
    return new Response('something-went-wrong', { status: 400 })
  }
}) as any