'use client'
import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
const Search = () => {
  const [randomUser, setRandomUser] = useState(null);

  const fetchRandomUser = async () => {
    try {
      const token = localStorage.getItem("token");

        const config = {
            headers: {
              Authorization: token,
            },
          };
      const response = await axios.get('http://localhost:9000/user/randomuser',config); 
      setRandomUser(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching random user:', error);
    }
  };

  return (
    <div>
      <NavBar/>
      <h1>Random User</h1>
      {randomUser ? (
        <div>
        <Link href={`/profile/${randomUser._id}`}>
          <p>Name: {randomUser.name}</p>
        </Link>
      </div>
      ) : (
        <p>No user fetched yet</p>
      )}

      <button onClick={fetchRandomUser}>Find Random User</button>
    </div>
  );
};

export default Search;
