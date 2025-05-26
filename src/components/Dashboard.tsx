"use client"
import axios from 'axios'
import { signOut } from 'next-auth/react'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

type Props = {
  numberOfReservations: number | null
}

const Dashboard = ({ numberOfReservations }: Props) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  
  const sendNotification = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/notifications', {
        title,
        content,
      })
      
      setTitle("")
      setContent("")
      toast.success("Notificarea a fost trimisă cu succes!")
    } catch (e) {
      toast.error("Ceva nu a mers bine. Încearcă din nou!")
    }

    setLoading(false)
  }
  return (
    <div className='min-h-screen w-full bg-base-200 flex flex-col items-center'>
      <form onSubmit={sendNotification} className='mt-20 w-full max-w-lg flex flex-col'>
        <button 
          className='btn btn-error mb-8 self-start'
          type='button'
          onClick={() => signOut()}
        >
          Ieși din cont
        </button>
        
        { numberOfReservations || numberOfReservations == 0 &&
          <p className='font-bold mb-4'>Număr de rezervări prin aplicația mobilă: {numberOfReservations}</p>
        }

        <h3 className='font-bold text-xl mb-12'>Trimite notificări</h3>

        <input 
          placeholder="Titlu notificare" 
          className="input w-full" 
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          placeholder="Content notificare" 
          className="input w-full mt-4" 
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className={loading ? 'btn btn-disabled w-fit btn-wide self-end mt-8' : 'btn btn-primary w-fit max-w-none btn-wide mt-8 self-end'}>
          Trimite notificare
        </button>
      </form>
      <Toaster />
    </div>
  )
}

export default Dashboard