import { db } from "@/lib/db"
import bcrypt from 'bcryptjs'
import { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { password } = await request.json()
    const { token } = await params
    const document = await db.collection('reset-tokens').findOne({ token }) as any
    
    if ( !document ) {
      return new Response("invalid-token", { status: 404 })
    }

    const pwHash = await bcrypt.hash(password, 10)
    await db.collection('users').updateOne({ email: document.email }, { $set: { pwHash }}) as any

    try {
      // await sendMail({ 
      //   to: document.email,
      //   html: generatePasswordUpdated(document.email, document.firstName, password),
      //   subject: 'Parola contului tău Monseori a fost modificată cu succes!'
      // })
    } catch (e) {}

    await db.collection('reset-tokens').deleteOne({ token })

    return Response.json('')
  } catch (e: any) {
    if (e.message && e.message == 'input must be a 24 character hex string, 12 byte Uint8Array, or an integer') {
      return new Response("No collection match given id.", { status: 404 })
    }
    return new Response(e.message, { status: 400 })
  }
}