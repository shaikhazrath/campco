'use client'
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
const Profile = () => {
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
      const res = await axios.get("http://localhost:9000/user/userprofile", config);
      setUserInfo(res.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  if(loading){
    return <h1>loading....</h1>
  }
  return (
    <div>
      <NavBar />
      {userInfo &&
      <>
      <h1>user:</h1>
      <h1>{userInfo.user.name}</h1>
      <h1>{userInfo.user.email}</h1>
      <h1>{userInfo.user._id}</h1>
      <h1>connctedusers:</h1>
      {userInfo.connectedUsers.map((user) => (
  <h1 key={user._id}>{user.name}</h1>
))}
      </>
      }
    </div>
  );
};

export default Profile;
