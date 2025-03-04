import axios from "axios"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const response = await axios.get(`https://login.smoobu.com/api/rates?start_date=2025-02-24&end_date=2027-04-24&apartments[]=${id}`, {
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY,
        'cache-control': 'no-cache'
      }
    })

    return Response.json(response.data.data[String(id)])
  } catch (e: any) {
    console.log(e.response.data)
    return new Response(e.response.data, { status: 400 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { arrivalDate, departureDate, guests } = await request.json()
    const { id } = await params
    
    const response = await axios.post('https://login.smoobu.com/booking/checkApartmentAvailability', {
      arrivalDate,
      departureDate,
      customerId: 9376,
      guests: guests ? guests : undefined,
      apartments: [id]
    }, 
    {
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY,
        'cache-control': 'no-cache'
      }
    })
    
    if (response.data.prices[String(id)]) {
      return Response.json(response.data.prices[String(id)])
    } else {
      return new Response('no-prices-available', { status: 400 })
    }
  } catch (e: any) {
    console.log(e)
    return new Response(e.message, { status: 400 })
  }
}