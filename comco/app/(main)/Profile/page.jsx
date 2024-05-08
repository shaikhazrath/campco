"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CiEdit } from "react-icons/ci";

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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/user/userprofile`,
        config
      );
      setUserInfo(res.data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(()=>{
const getUserPosts = async ()=>{
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token,
      },
    };
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/posts/userPosts`,
      config
    );
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}
getUserPosts()
  },[])



  useEffect(() => {
    getUserProfile();
  }, []);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const adjustedCurrentYear = currentMonth >= 6 ? currentYear + 1 : currentYear;

  const handleUpdate = () => {
    router.push("/Profile/Update");
  };
  if (loading) {
    return <h1>Loading....</h1>;
  }

  const mockPosts = [
    {
      _id: 1,
      userName: 'John Doe',
      userAvatar: 'https://via.placeholder.com/40',
      postedTime: new Date('2023-05-01T10:30:00'),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      _id: 2,
      userName: 'Jane Smith',
      userAvatar: 'https://via.placeholder.com/40',
      postedTime: new Date('2023-05-02T14:45:00'),
      description: 'Nullam quis risus eget urna mollis ornare vel eu leo.',
    },
    {
      _id: 3,
      userName: 'Bob Johnson',
      userAvatar: 'https://via.placeholder.com/40',
      postedTime: new Date('2023-05-03T08:15:00'),
      description: 'Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus.',
    },
    {
      _id: 4,
      userName: 'Sarah Lee',
      userAvatar: 'https://via.placeholder.com/40',
      postedTime: new Date('2023-05-04T16:20:00'),
      description: 'Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum.',
    },
    {
      _id: 5,
      userName: 'Michael Brown',
      userAvatar: 'https://via.placeholder.com/40',
      postedTime: new Date('2023-05-05T12:00:00'),
      description: 'Aenean lacinia bibendum nulla sed consectetur. Nullam quis risus eget urna mollis ornare vel eu leo.',
    },
    {
      _id: 6,
      userName: 'Emily Davis',
      userAvatar: 'https://via.placeholder.com/40',
      postedTime: new Date('2023-05-06T09:30:00'),
      description: 'Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.',
    },
  ];
  return (
  
    <div className=" bg-background h-screen overflow-y-scroll">
      <NavBar/>
      {/* Header Section */}
      <div className="  py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="mr-4 border-4 border-white md:w-28 md:h-28 h-20 w-20 ">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="md:text-3xl text-xl font-bold text-white ">
                  <span className="capitalize">{userInfo.name.charAt(0)}</span>
                  {userInfo.name.slice(1)}
                </h1>
              </div>
            </div>
            <button
              className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-indigo-500 hover:text-white transition duration-300 text-sm"
              onClick={handleUpdate}
            >
             <CiEdit size={20} />

            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-16 ">
        <div className=" rounded-lg shadow-lg overflow-hidden bg-foreground text-white">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <h2 className="text-2xl font-bold">
                    {userInfo.branch}{" "}
                    {userInfo.pass_out_year < adjustedCurrentYear &&
                      "(Graduated)"}
                    {userInfo.pass_out_year === adjustedCurrentYear &&
                      "(4th Year)"}
                    {userInfo.pass_out_year - adjustedCurrentYear === 1 &&
                      "(3rd Year)"}
                    {userInfo.pass_out_year - adjustedCurrentYear === 2 &&
                      "(2nd Year)"}
                    {userInfo.pass_out_year - adjustedCurrentYear === 3 &&
                      "(1st Year)"}
                  </h2>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h1 className="text-white whitespace-pre-wrap break-words">
                {userInfo.bio}
              </h1>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Connections</h2>
                <h2 className="text-lg font-bold">
                  {userInfo.connectedUsers.length}
                </h2>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
{/* mockPosts */}
{/* Posts Section */}
<div className="container mx-auto px-4 py-8">
  <h2 className="text-2xl font-bold text-white mb-6">Posts</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {mockPosts.map((post) => (
      <div
        key={post._id}
        className="bg-foreground rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-4 flex">
          <Avatar className="mr-4 w-10 h-10">
            <AvatarImage src={post.userAvatar} alt={post.userName} />
            <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h3 className="text-white font-semibold mr-2">
                  {post.userName}
                </h3>
                <span className="text-sm text-gray-400">
                  {post.postedTime.toLocaleString()}
                </span>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-300">{post.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default Profile;
