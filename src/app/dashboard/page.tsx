import Dashboard from '@/components/Dashboard'
import { db } from '@/lib/db'
import React from 'react'

const page = async () => {
  let numberOfReservations: number | null = null
  
  return (
    <Dashboard />
  )
}

export default page