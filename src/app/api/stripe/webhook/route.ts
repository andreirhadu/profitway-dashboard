import { db } from "@/lib/db"
import axios from "axios"

export async function POST(request: Request) { 
  const event = await request.json()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object

        if ( paymentIntent.metadata && paymentIntent.metadata.reservation ) {
          try {
            const reservation = JSON.parse(paymentIntent.metadata.reservation)

            await axios.post('https://login.smoobu.com/api/reservations', 
              {
                ...reservation
              },
              {
                headers: {
                  'Api-Key': process.env.SMOOBU_API_KEY,
                  'cache-control': 'no-cache'
                }
              } 
            )

            await db.collection('reservations').insertOne({
              ...reservation,
              paymentIntentId: paymentIntent.id
            })
      
          } catch (e: any) {
            throw e
          }
        }
        
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (e: any) {
    if (e.response && e.response.data) {
      return new Response(e.response.data, { status: 400 })
    }
    return new Response(e.message, { status: 400 })
  }

  return Response.json({received: true})
}