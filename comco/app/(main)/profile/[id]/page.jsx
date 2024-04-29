'use client'
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";

const OthersProfile = ({params}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false); 
  const  userId  = params.id

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: token
        },
      };
      const res = await axios.get(`http://localhost:9000/user/othersprofile/${userId}`, config);
      setUserInfo(res.data);
      setIsRequested(res.data.isRequested); 
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
     const req = await axios.get(`http://localhost:9000/user/sendRequest/${userId}`, config);
     console.log(req)
      setIsRequested(true); // Update state to reflect the request being sent
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1>loading....</h1>;
  }

  return (
    <div>
      <NavBar />
      {userInfo && (
        <>
          <h1>{userInfo.name}</h1>
          <h1>{userInfo.email}</h1>
          <h1>{userInfo._id}</h1>
          <button onClick={sendRequest}>Send Request</button>
        </>
      )}
    </div>
  );
};

export default OthersProfile;
