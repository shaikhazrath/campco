'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const Search = () => {
  const [people, setPeople] = useState(null);

  const fetchpeople = async () => {
    try {
      const token = localStorage.getItem("token");

        const config = {
            headers: {
              Authorization: token,
            },
          };
      const response = await axios.get('https://fromloop.vercel.app/user/findpeople',config); 
      setPeople(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching random user:', error);
    }
  };
  useEffect(()=>{
    fetchpeople()
  },[])

  return (
    <div className=' text-primary'>
      <NavBar/>
      {people ? (
      people.map((p, index) => (
        <div key={index} className='flex justify-center'>
          <Link href={`/Profile/${p._id}`} className='flex gap-10 items-center bg-foreground m-5 rounded-xl px-10 py-3 '>
          <Avatar className="h-16 w-16">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                  <h1 className="text-2xl font-bold tracking-wider">
  <span style={{ textTransform: 'capitalize' }}>{p.name.charAt(0)}</span>{p.name.slice(1)}
</h1>              
<div className=' flex gap-5'>
<h1 className=' text-sm tracking-wider'>{p.branch}</h1>
</div>
      

                  </div>

          </Link>
        </div>
      ))
      
      ) : (
        <p>No user fetched yet</p>
      )}

    </div>
  );
};

export default Search;
