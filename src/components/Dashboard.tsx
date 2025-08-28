"use client"
import axios from 'axios'
import { signOut } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const Dashboard = () => {
  const [tab, setTab] = useState("notifications")

  // notificări
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  // recenzii
  const [reviews, setReviews] = useState<{ id: string }[]>([])
  const [newReviewId, setNewReviewId] = useState("")
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    if (tab === "reviews") {
      fetchReviews()
    }
  }, [tab])

  const fetchReviews = async () => {
    setLoadingReviews(true)
    try {
      const res = await axios.get("/api/reviews")
      setReviews(res.data.reviews || [])
    } catch (e) {
      toast.error("Nu am putut încărca recenziile")
    }
    setLoadingReviews(false)
  }

  const deleteReview = async (id: string) => {
    try {
      await axios.delete(`/api/reviews?id=${id}`)
      setReviews(reviews.filter((r: any) => r.id !== id))
      toast.success("Recenzia a fost ștearsă!")
    } catch (e) {
      toast.error("Eroare la ștergerea recenziei")
    }
  }

  const addReview = async (e: any) => {
    e.preventDefault()
    if (!newReviewId.trim()) return

    try {
      const res = await axios.post("/api/reviews", { id: newReviewId.trim() })
      setReviews([{ id: newReviewId.trim()}, ...reviews])
      setNewReviewId("")
      toast.success("Recenzia a fost adăugată!")
    } catch (e) {
      toast.error("Eroare la adăugarea recenziei")
    }
  }

  const sendNotification = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/notifications', { title, content })
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
      <div className='flex flex-col items-center w-full max-w-screen-md'>
        <div className='flex flex-row-reverse items-center justify-between mt-10 w-full'>
          <button 
            className='btn btn-error'
            type='button'
            onClick={() => signOut()}
          >
            Ieși din cont
          </button>

          {/* Tabs */}
          <div role="tablist" className="tabs tabs-boxed w-fit">
            <a 
              role="tab" 
              className={`tab ${tab === "notifications" ? "tab-active" : ""}`} 
              onClick={() => setTab("notifications")}
            >
              Trimite notificări
            </a>
            <a 
              role="tab" 
              className={`tab ${tab === "reviews" ? "tab-active" : ""}`} 
              onClick={() => setTab("reviews")}
            >
              Recenzii
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-lg mt-10">
          {tab === "notifications" && (
            <form onSubmit={sendNotification} className='flex flex-col'>
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

              <button 
                className={loading 
                  ? 'btn btn-disabled w-fit btn-wide self-end mt-8' 
                  : 'btn btn-primary w-fit btn-wide mt-8 self-end'}
              >
                Trimite notificare
              </button>
            </form>
          )}

          {tab === "reviews" && (
            <div className='mb-20'>
              <h3 className='font-bold text-xl mb-8'>Lista recenzii</h3>
              
              <form onSubmit={addReview} className='flex gap-2 mb-8'>
                <input
                  placeholder="ID recenzie (YouTube ID)"
                  className="input flex-1"
                  value={newReviewId}
                  onChange={(e) => setNewReviewId(e.target.value)}
                />
                <button className="btn btn-primary">Adaugă</button>
              </form>

              {loadingReviews ? (
                <p>Se încarcă...</p>
              ) : (
                <ul className='list-disc list-inside space-y-2'>
                  {reviews.map((review: any, idx) => (
                  <li key={idx} className='flex justify-between items-center p-2 rounded'>
                    <span>{review.id}</span>
                    <button 
                      className="btn btn-error btn-xs"
                      onClick={() => deleteReview(review.id)}
                    >
                      Șterge
                    </button>
                  </li>
                ))}
                  {reviews.length === 0 && <p>Nu există recenzii adăugate încă.</p>}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  )
}

export default Dashboard