'use client'
import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'

const Upload = () => {
  const [postText, setPostText] = useState('')

  const handlePostTextChange = (e) => {
    setPostText(e.target.value)
  }

  const handlePostSubmit = (e) => {
    e.preventDefault()
    console.log('Post text:', postText)
    setPostText('')
  }

  return (
    <div>
      <NavBar />
      <div className='flex justify-center'>

      <div className="flex mt-8 flex-col gap-4 px-5 h-screen md:w-1/3">
          <Textarea
            className="w-full  focus:outline-none focus:ring-0  border-none text-white text-lg max h-1/3 resize-none focus-visible:ring-0 focus-visible:ring-ring -visible:ring-offset-0"
          
            placeholder="What's happening?"
            value={postText}
            onChange={handlePostTextChange}
            maxLength={300}
            rows={4}
          />
            <Button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-500  rounded-md text-lg "
            >
              Post
            </Button>
      </div>
    </div>
    </div>

  )
}

export default Upload