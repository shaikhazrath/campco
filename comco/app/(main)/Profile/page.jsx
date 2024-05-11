"use client";
import React, { useEffect, useState,useRef } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BottomNavBar from "@/components/BottomNavBar";
const Profile = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const scrollContainerRef = useRef(null);
  const [scroll, setScroll] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const currentScrollPosition = scrollContainerRef.current.scrollTop;
  
  
        if (currentScrollPosition <= scrollValue) {
          setScroll(false);
      setScrollValue(currentScrollPosition);

        } else {
          setScroll(true);
      setScrollValue(currentScrollPosition);

        }
      }
    };
  
    if(scrollContainerRef.current){
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
  
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }
  });
  
 
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

  const getUserPosts = async () => {
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
      console.log(res.data);
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
    getUserPosts();
  }, []);


  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const adjustedCurrentYear = currentMonth >= 6 ? currentYear + 1 : currentYear;

  const handleUpdate = () => {
    router.push("/Profile/Update");
  };

  const handleDeletePost = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/posts/deletePost/${id}`,
        config
      );
      getUserPosts();
      setLoading(false);

      console.log(res);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <div>
      <NavBar />
      <BottomNavBar scrolling={scroll}/>
      <div ref={scrollContainerRef} className=" h-screen overflow-scroll   ">

      <div className="py-8 pb-20 ">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="mr-4 border-4 border-white md:w-28 md:h-28 h-20 w-20 ">
                <AvatarImage src={userInfo.profileImage} alt="@shadcn" />
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

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts &&
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-foreground rounded-lg shadow-lg overflow-hidden "
              >
                <div className="p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2 border-b border-b-gray-800 pb-4">
                    <div className="flex items-center">
                      <Avatar className="mr-4 w-10 h-10">
                        <AvatarImage
                          src={userInfo.profileImage}
                          alt={userInfo.name}
                        />
                      </Avatar>
                      <h3 className="text-white font-medium text-sm mr-2">
                        {userInfo.name}
                      </h3>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild className=" bg-foreground">
                        <div>
                          <MdDelete className=" text-red-500" size={20} />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure? you want to delete
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePost(post._id )}
                            className="bg-red-500 text-xl font-bold w-full"
                          >
                            Delete
                            <MdDelete className=" text-white" size={20} />
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div>
                    <p className="text-gray-300">{post.posts}</p>
                    <span className="text-sm text-gray-400">
                      {
                        new Date(post.DateAndTime)
                          .toLocaleString()
                          .split(",")[0]
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    </div>

  );
};

export default Profile;
