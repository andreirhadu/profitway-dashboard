import { db } from "@/lib/db"

export async function POST(request: Request) {
  const { action, data } = await request.json()

  try {
    const reservation = await db.collection('reservations').findOne({ _id: data.id })
    
    if ( !reservation ) {
      return Response.json({ message: 'Reservation not found.' }, { status: 200 })
    }

    if ( action == 'cancelReservation' ) {
      await db.collection('reservations').updateOne({ _id: data.id }, { $set: { status: 'canceled' } })
    } else if ( action == 'updateReservation' ) {
      await db.collection('reservations').updateOne({ _id: data.id }, { $set: {
        createdAt: new Date(data['created-at']),
        apartmentId: data.apartment.id,
        channelId: data.channel.id,
        adults: data.adults,
        children: data.children,
        price: data.price,
        prepayment: data.prepayment,
        prepaymentStatus: data['prepayment-paid'] == 'Yes' ? 1 : 0,
        priceStatus: data['price-paid'] == 'Yes' ? 1 : 0,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        arrivalTime: data['check-in'],
        departureTime: data['check-out'],
        arrivalDate: data.arrival,
        departureDate: data.departure,
        notice: data.notice,
        paymentStatus: data['price-paid'] == 'Yes' ? 'paid' : 'partial'  
      }})
    }

    return Response.json({ success: true })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}