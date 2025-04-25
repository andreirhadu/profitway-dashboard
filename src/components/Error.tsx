import React from 'react'

type Props = {
  errorText: string
  className?: string
}

const Error = ({ errorText, className="" }: Props) => {
  return (
    <div className={`flex gap-x-2 items-center text-rose-700 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className='pt-1'>{ errorText }</span>
    </div>
  )
}

export default Error