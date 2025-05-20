"use client"
import Error from '@/components/Error'
import Logo from '@/components/Logo'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const page = ({ searchParams }: Props) => {
  const router = useRouter()
  const [error, setError] = useState< string | null >(null)
  const [loading, setLoading] = useState(false)

  const login = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await signIn("credentials", {
      redirect: false,
      email: e.target.email.value.toLowerCase(),
      password: e.target.password.value,
    })

    setLoading(false)
    if (res?.error) {
      if ( res.error == 'CredentialsSignin' ) {
        setError('Email sau parolă greșită!')
      } else {
        setError('Ceva nu a mers bine. Încearcă din nou!')
      }
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className='h-screen w-full bg-base-200 flex items-center justify-center'>
      <form
        onSubmit={login}
        className='rounded-3xl shadow-xl p-12 px-12 md:p-12 md:px-24 bg-base-100 flex flex-col items-center w-full max-w-[450px]'
      >
        <Logo size='large' />
        <div className='h-12 flex items-end pb-2'>
          { loading && <span className="loading loading-spinner loading-sm"></span>}
          { error && <Error errorText={error} />}
        </div>
        <input 
          type="text" 
          name='email'
          placeholder="Email" 
          className="input w-full" 
        />
        <input 
          type="password" 
          name='password'
          placeholder="Parolă" 
          className="input w-full mt-4" 
        />
        <button className={loading ? 'btn btn-disabled w-full btn-wide mt-4' : 'btn btn-primary w-full max-w-none btn-wide mt-4'}>
          Intră în cont
        </button>
        
        {/* <Link 
          href='/forgot-password'
          className='font-medium hover:text-primary mt-8 transition-all duration-300'
        >
          Ai uitat parola?
        </Link> */}
      </form>
    </div>
  )
}

export default page
