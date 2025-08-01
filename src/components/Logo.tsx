import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  size?: 'small' | 'large'
}

const Logo = ({ size='small' }: Props) => {
  return (
    <Link href='/' className='z-10'>
      { size == 'small' ?
        <div className='flex flex-row items-center gap-x-2 w-fit'>
          <Image 
            src='/logo.png'
            width={64}
            height={64}
            alt='logo'
            className='w-8 h-8'
          />
          <p className='font-black mt-1 text-[17px]'></p>
        </div> : 
        <div className='flex flex-row items-center gap-x-2 w-fit'>
          <Image 
            src='/logo.png'
            width={250}
            height={250}
            alt='logo'
            className='w-36 h-auto'
          />
          <p className='font-black mt-1 text-xl'></p>
        </div>
      }
    </Link>
  )
}

export default Logo