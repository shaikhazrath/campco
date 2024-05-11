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
    <NavBar url='/Profile'/>
    <div className="max-w-lg mx-auto p-6  bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-white mb-4">Update Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center mb-4">
          <Avatar className="md:w-36 h-36 w-36">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium text-white mb-2">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-foreground text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block font-medium text-white mb-2">Bio:</label>
          <textarea
  id="bio"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  className="w-full bg-foreground text-white p-2 h-36 rounded-lg"
  rows="3"
></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="branch" className="block font-medium text-white mb-2">Branch:</label>
          <select className="w-full px-3 py-2 bg-foreground text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id="branch" value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option key='1' value='ECE'>ECE</option>
            <option key='2' value='CSE'>CSE</option>
            <option key='3' value='ME'>ME</option>
            <option key='4' value='EEE'>EEE</option>
            <option key='5' value='CE'>CE</option>
            <option key='6' value='IT'>IT</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="passoutYear" className="block font-medium text-white mb-2">Passout Year:</label>
          <select className="w-full px-3 py-2 bg-foreground text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id="passoutYear" value={passoutYear} onChange={(e) => setPassoutYear(e.target.value)}>
            {passoutYearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-indigo-500 hover:text-white transition duration-300 w-full">Save</Button>
      </form>
    </div>
  </div>
  );
};

export default UpdateProfile;
