import { db } from "@/lib/db"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  const { email } = await request.json()
  
  try {
    const document = await db.collection('users').findOne({ email })
    if ( !document ) {
      return Response.json('')
    }

    const token = randomUUID()

    await db.collection('reset-tokens').insertOne({ email, token: token, firstName: document.firstName })

    // await sendMail({ 
    //   to: email,
    //   html: generateResetTokenMail(email, token, 'customer'),
    //   subject: 'Resetează parola contului tău Monseori!'
    // })

    return Response.json('')
  } catch (e: any) {
    return new Response(e, { status: 400 })
  }
}