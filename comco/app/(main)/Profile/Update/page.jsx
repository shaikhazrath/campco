'use client'
import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [branch,setBranch] = useState('')
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/user/updateProfile`,
        { name, bio , pass_out_year: passoutYear,branch },
        config
      );
      router.push('/Profile')
    } catch (error) {
      setError(error.response.data.error);
      console.error('Update profile failed:', error.response);
    }
  };


  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user/userprofile`, config);
      setName(res.data.user.name);
      setBio(res.data.user.bio)
      const currentYear = new Date().getFullYear();
      setPassoutYear(res.data.user.pass_out_year || currentYear)
      setBranch(res.data.user.branch || 'ECE'); 


      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);


  if (loading) {
    return <h1>Loading....</h1>;
  }
  const currentYear = new Date().getFullYear();
  const passoutYearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);


  return (
    <div>
      <NavBar  url='/profile'/>
      <div className='text-white w-full flex justify-center items-center flex-col md:m-5'>
        <h2 className=' text-xl text-white font-bold my-5'>Update Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} className=' w-full md:w-1/5 p-5 flex flex-col justify-center gap-5 '>
        <Avatar className=' w-28 h-28 '>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
          <div>
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bio">Bio:</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="branch">Branch:</label>
            <select className=' bg-background border px-5 py-1 m-2 text-md rounded-sm border-white'
        id="branch"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
>
    <option key='1' value='ECE'>ECE</option>
    <option key='2' value='CSE'>CSE </option>
    <option key='3' value='ME'>ME </option>
    <option key='4' value='EEE'>EEE</option>
    <option key='5' value='CE'>CE</option>
    <option key='6' value='IT'>IT </option>
    {/* Add more options as needed */}
</select>
          </div>
          <div>
            <label htmlFor="passoutYear">Passout Year:</label>
            <select className=' bg-background border px-5 py-1 m-2 text-md rounded-sm border-white'
              id="passoutYear"
              value={passoutYear}
              onChange={(e) => setPassoutYear(e.target.value)}
            >
              {passoutYearOptions.map(year => (
                <option key={year} value={year} >{year}</option>
              ))}
            </select>
          </div>

          <Button type="submit" className='text-black'>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
