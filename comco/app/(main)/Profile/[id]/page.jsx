"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { MdDelete } from "react-icons/md";

const OthersProfile = ({ params }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectedStatusLoading,setConnectedStatusLoading] = useState(false)
  const [posts, setPosts] = useState(null);
  const userId = params.id;

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/user/othersprofile/${userId}`,
        config
      );
      setUserInfo(res.data);
      
      console.log(res.data);
      setConnectionStatus(res.data.connectionStatus);
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
        `${process.env.NEXT_PUBLIC_URL}/posts/userPosts/${userId}`,
        config
      );
      console.log(res.data);
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    getUserPosts();
  }, []);

  const sendRequest = async () => {
    setConnectedStatusLoading(true)
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const req = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/user/sendRequest/${userId}`,
        config
      );
      setConnectedStatusLoading(false)

      getProfile()
      console.log(req);
      setIsRequested(true); // Update state to reflect the request being sent
    } catch (error) {
      setConnectedStatusLoading(false)

      console.log(error);
    }
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }
  const removeRequest = async () => {
    setConnectedStatusLoading(true)

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const req = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/user/removeRequest/${userId}`,
        config
      );
      console.log(req);
      getProfile()
      setConnectedStatusLoading(false)

      setIsRequested(false);
    } catch (error) {
      console.log(error);
      setConnectedStatusLoading(false)

    }
  };

  const acceptRequest = async () => {
    setConnectedStatusLoading(true)

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const req = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/user/acceptRequest/${userId}`,
        config
      );
      getProfile()
      setConnectedStatusLoading(false)

      console.log(req);
      setIsRequested(false);
    } catch (error) {
      setConnectedStatusLoading(false)

      console.log(error);
    }
  };
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const adjustedCurrentYear = currentMonth >= 6 ? currentYear + 1 : currentYear;

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
                src={userInfo.profileImage}
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
        
<div className="">
            <Button
              className={`bg-white text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-800 transition duration-300 text-sm ${
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : connectionStatus === 'removeRequest'
                  ? 'bg-red-500'
                  : connectionStatus === 'acceptRequest'
                  ? 'bg-blue-500'
                  : connectionStatus === 'sendRequest'
                  ? 'bg-purple-500'
                  : ''
              }`}
              onClick={() => {
                switch (connectionStatus) {
                  case 'connected':
                    break;
                  case 'removeRequest':
                    removeRequest();
                    break;
                  case 'acceptRequest':
                    acceptRequest();
                    break;
                  case 'sendRequest':
                    sendRequest();
                    break;
                  default:
                    break;
                }
              }}
            >
              {connectionStatus === 'connected' && 'connected'}
              {connectionStatus === 'removeRequest' && 'Remove request'}
              {connectionStatus === 'acceptRequest' && 'Accept Request'}
              {connectionStatus === 'sendRequest' && 'Send Request'}
              
            </Button>
          </div> 
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
                <h2 className="text-2xl font-bold flex items-end gap-2">
                  {userInfo.branch}
                  <h1 className=" font-normal text-base">
                  {userInfo.pass_out_year < adjustedCurrentYear &&
                    "Graduated"}
                  {userInfo.pass_out_year === adjustedCurrentYear &&
                    "4th Year"}
                  {userInfo.pass_out_year - adjustedCurrentYear === 1 &&
                    "3rd Year"}
                  {userInfo.pass_out_year - adjustedCurrentYear === 2 &&
                    "2nd Year"}
                  {userInfo.pass_out_year - adjustedCurrentYear === 3 &&
                    "1st Year"}
                    </h1>
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
                {userInfo.connectedUsersCount}
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
  );
};

export default OthersProfile;


{/* */}