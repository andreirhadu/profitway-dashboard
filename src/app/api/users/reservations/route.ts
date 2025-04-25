import { db } from '@/lib/db'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
  const bearer = request.headers.get('Authorization')

  if (!bearer) {
    return new Response('Token is required.', { status: 401 })
  }

  const token = bearer.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(decoded.userId) })
    
    if (!user) {
      return new Response('Invalid token.', { status: 401 })
    }
    
    const reservations = await db.collection('reservations').find({ userId: String(user._id) }).toArray()
    return Response.json({ reservations })
  } catch (error) {
    return new Response('Invalid or expired token.', { status: 401 })
  }
}

export async function POST(request: Request) {
  const bearer = request.headers.get('Authorization')

  if (!bearer) {
    return new Response('Token is required.', { status: 401 })
  }

  const token = bearer.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(decoded.userId) })
    
    if (!user) {
      return new Response('Invalid token.', { status: 401 })
    }

    const { reservationId } = await request.json()

    const response = await axios.get(`https://login.smoobu.com/api/reservations/${reservationId}`, {
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY,
        'cache-control': 'no-cache'
      }
    })

    const reservation = await db.collection('reservations').findOne({ _id: Number(reservationId) as any })

    if ( reservation ) {
      if ( reservation.userId != String(user._id)) {
        return new Response('already-assigned', { status: 404 })
      } else {
        return new Response('already-assigned-to-you', { status: 404 })
      }
    }

    const { insertedId } = await db.collection('reservations').insertOne({ 
      _id: response.data.id,
      userId: String(user._id),
      createdAt: new Date(response.data['created-at']),
      apartmentId: response.data.apartment.id,
      channelId: response.data.channel.id,
      adults: response.data.adults,
      children: response.data.children,
      price: response.data.price,
      prepayment: response.data.prepayment,
      prepaymentStatus: response.data['prepayment-paid'] == 'Yes' ? 1 : 0,
      priceStatus: response.data['price-paid'] == 'Yes' ? 1 : 0,
      firstName: response.data.firstname,
      lastName: response.data.lastname,
      email: response.data.email,
      arrivalTime: response.data['check-in'],
      departureTime: response.data['check-out'],
      arrivalDate: response.data.arrival,
      departureDate: response.data.departure,
      notice: response.data.notice,
      paymentStatus: response.data['price-paid'] == 'Yes' ? 'paid' : 'partial'  
    })

    const newReservation = await db.collection('reservations').findOne({ _id: insertedId })

    return Response.json({ reservation: newReservation })
  } catch (e: any) {
    console.log(e.response.data)
    if ( e.response && e.response.data && e.response.data.title == 'Entity not found' ) {
      return new Response('id-not-found', { status: 404 })
    }

    return new Response('error', { status: 400 })
  }
}