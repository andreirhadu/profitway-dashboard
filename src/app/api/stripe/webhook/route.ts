import { metadata } from "@/app/layout"
import { db } from "@/lib/db"
import axios from "axios"

export async function POST(request: Request) { 
  const event = await request.json()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object

        if ( paymentIntent.metadata ) {
          try {
            await axios.post('https://login.smoobu.com/api/reservations', 
              {
                ...metadata,
                address: JSON.parse(paymentIntent.metadata.address),
                priceElements: JSON.parse(paymentIntent.metadata.priceElements),
              },
              {
                headers: {
                  'Api-Key': process.env.SMOOBU_API_KEY,
                  'cache-control': 'no-cache',
                  'Content-Type': 'application/json'
                }
              } 
            )

            await db.collection('reservations').insertOne({
              ...metadata,
              address: JSON.parse(paymentIntent.metadata.address),
              priceElements: JSON.parse(paymentIntent.metadata.priceElements),
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
      console.log(e.response.data)
      return new Response(e.response.data.validation_messages, { status: 400 })
    }
    return new Response(e.message, { status: 400 })
  }

  return Response.json({received: true})
}