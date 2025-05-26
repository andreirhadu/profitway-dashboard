import Dashboard from '@/components/Dashboard'
import { db } from '@/lib/db'
import React from 'react'

const page = async () => {
  let numberOfReservations: number | null = null
  
  try {
    numberOfReservations = await db.collection('reservations').countDocuments({ source: 'mobile-app', status: { $ne: 'canceled' } }) 
  } catch (e: any) {
    console.log(e)
  }
  
  return (
    <Dashboard 
      numberOfReservations={numberOfReservations}
    />
  )
}

export default page