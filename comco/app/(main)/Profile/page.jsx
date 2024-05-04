'use client'
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Profile = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user/userprofile`, config);
      setUserInfo(res.data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const adjustedCurrentYear = currentMonth >= 6 ? currentYear + 1 : currentYear;


  const handleupdate =()=>{
    router.push('/Profile/update')
  }
  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className="text-white min-h-screen">
      <NavBar />
      {userInfo && (
        <div className="max-w-2xl mx-auto pt-8">
          <div className="flex items-center flex-col md:flex-row justify-center px-5 gap-5">
            <div className="mr-8">
              <Avatar className='h-48 w-48'>
                <AvatarImage  src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex gap-3 flex-col">
            <h1 className="text-2xl font-bold tracking-wider">
  <span style={{ textTransform: 'capitalize' }}>{userInfo.name.charAt(0)}</span>{userInfo.name.slice(1)}
</h1>              {/* <h2 className="text-lg text-gray-100">{userInfo.user.email}</h2> */}
              <p className="text-md font-medium tracking-wide">{userInfo.bio}</p>
              <div className="flex gap-5 uppercase">
              <div className=" bg-blue-300 border-2 rounded-lg border-blue-700 text-black px-2 py1 text-lg font-semibold " ><h1>{userInfo.branch}</h1></div>
              <div className=" bg-green-300 border-2 rounded-lg border-green-700 text-black px-2 py1 text-lg font-semibold " >
              <h1>
    {userInfo.pass_out_year < adjustedCurrentYear && 'Graduated'}
    {userInfo.pass_out_year === adjustedCurrentYear && '4 Year'}
    {userInfo.pass_out_year - adjustedCurrentYear === 1 && '3 Year'}
    {userInfo.pass_out_year - adjustedCurrentYear === 2 && '2 Year'}
    {userInfo.pass_out_year - adjustedCurrentYear === 3 && '1 Year'}
  </h1>
</div>
                        </div>
              

              <div className="flex items-center gap-2">
              <h2 className="text-md font-bold text-blue-100 ">Connections</h2>
              <h2 className="text-sm font-bold text-blue-100 ">{userInfo.connectedUsers.length}</h2>
              </div>
              <div className="flex w-full justify-center">
              <Button className='text-black w-full  text-xl ' onClick={handleupdate}>Edit Profile</Button>
              </div>
              
            </div>
          </div>
          {/* <div className="mt-8 grid grid-cols-3 gap-4">
            {userInfo.posts.map((post) => (
              <div key={post._id} className="relative">
                <img src={post.image} alt="post" className="w-full h-full object-cover rounded" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-sm">{post.caption}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Profile;
