"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OthersProfile = ({ params }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
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

  useEffect(() => {
    getProfile();
  }, []);

  const sendRequest = async () => {
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
      getProfile()
      console.log(req);
      setIsRequested(true); // Update state to reflect the request being sent
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }
  const removeRequest = async () => {
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
      setIsRequested(false);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async () => {
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
      console.log(req);
      setIsRequested(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
<div className="text-white min-h-screen">
  <NavBar />
  {userInfo && (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="flex items-center flex-col md:flex-row justify-center px-5 gap-5">
        <div className="mr-8">
          <Avatar className="md:h-48 md:w-48 h-36 w-36">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-3 flex-col">
          <h1 className="text-2xl font-bold tracking-wider">
            <span style={{ textTransform: "capitalize" }}>
              {userInfo.username.charAt(0)}
            </span>
            {userInfo.username.slice(1)}
          </h1>
          <p className="text-md font-medium tracking-wide">{userInfo.bio}</p>
          <div className="flex gap-5 uppercase">
            <div className="border-b-2 border-green-400">
              <h1>{userInfo.branch}</h1>
            </div>
            <div className="border-b-2 border-blue-400">
              <h1>
                {userInfo.pass_out_year < new Date().getFullYear() && "Graduated"}
                {userInfo.pass_out_year === new Date().getFullYear() && "4 Year"}
                {userInfo.pass_out_year - new Date().getFullYear() === 1 && "3 Year"}
                {userInfo.pass_out_year - new Date().getFullYear() === 2 && "2 Year"}
                {userInfo.pass_out_year - new Date().getFullYear() === 3 && "1 Year"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-md font-bold text-blue-100">Connections</h2>
            <h2 className="text-sm font-bold text-blue-100">
              {userInfo.connectedUsersCount}
            </h2>
          </div>
          <div className="flex w-full justify-center">
            <Button
              className={`text-white font-bold w-full text-xl rounded-xl ${
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
  )}
</div>
  );
};

export default OthersProfile;
