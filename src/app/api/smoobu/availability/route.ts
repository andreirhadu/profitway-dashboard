import axios from "axios"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { arrivalDate, departureDate, guests } = await request.json()
    
    const response = await axios.post('https://login.smoobu.com/booking/checkApartmentAvailability', {
      arrivalDate,
      departureDate,
      customerId: 9376,
      guests: guests ? guests : undefined,
      apartments: [1043664, 24599, 873748]
    }, 
    {
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY,
        'cache-control': 'no-cache'
      }
    })

    return Response.json(response.data)
  } catch (e: any) {
    console.log(e.response.data)
    return new Response(e.response.data, { status: 400 })
  }
}