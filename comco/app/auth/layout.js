'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import '../globals.css'
import patternSvg from '@/public/pattern.svg'

export default function RootLayout({ children }) {
  const router = useRouter()
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const token = localStorage.getItem('token')

    if(token){
      router.push('/')
    }
    setLoading(false)

  },[router])
  // if(loading){
  //   return <h1>loading...</h1>
  // }
  return (
    <html lang="en">
      <body>
        {children}</body>
    </html>
  )
}
