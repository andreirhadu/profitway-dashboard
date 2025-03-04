import { metadata } from "@/app/layout"
import { db } from "@/lib/db"
import { ObjectId } from "mongodb"
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: Request) {  
  try {
    const { userId, amount_today, arrivalDate, departureDate, apartmentId, arrivalTime, departureTime, phone, adults, children, price, country, notice } = await request.json()
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) })
    var customer = null

    if ( user && user.stripeId ) {
      customer = await stripe.customers.retrieve(user.stripeId)
    }
    
    if (!customer) {
      customer = await stripe.customers.create({
        email: user!.email, 
        name: user!.firstName + ' ' + user!.lastName
      })

      await db.collection('users').updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $set: { stripeId: customer.id } }
      )
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-12-18.acacia'}
    )

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount_today*100,
      currency: 'ron',
      metadata: {
        arrivalDate,
        departureDate,
        channelId: 36848,
        apartmentId,
        arrivalTime: arrivalTime ? arrivalTime : '11:00',
        departureTime: departureTime ? departureTime : null,
        firstName: user!.firstName,
        lastName: user!.lastName,
        email: user!.email,
        phone,
        adults,
        children,
        price: price,
        priceStatus: amount_today == price ? 1 : 0,
        prepaymentStatus: amount_today == price ? undefined : 1,
        prepayment: amount_today == price ? undefined : amount_today,
        country: country,
        notice: notice,
        address: JSON.stringify({
          street: '',
          postalCode: '',
          location: '',
        }),
        priceElements: JSON.stringify([
          {
            "type": "basePrice",
            "name": "Base price",
            "amount": price,
            "quantity": null,
            "tax": null,
            "currencyCode": "RON",
          },
        ])
      }
    })
  
    return Response.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })

  } catch (e: any) {
    console.log(e)
    return new Response(e, { status: 400 })
  }
}