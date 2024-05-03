"use client";
import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
const GoogleAuth = () => {
  const router = useRouter();
  const [error, setError] = useState();
  const responseGoogle = async (response) => {
    try {
      const idToken = response.credential;
      const res = await axios.post(`https://fromloop.vercel.app/user`, {
        idToken,
      });
      if(res.data.message)
      localStorage.setItem("token", res.data.token);
      router.push("/Profile");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  const onFailure = (error) => {
    console.error("Google sign-in failed:", error);
  };

  return (
  
    <div className=" h-screen  flex items-center justify-center flex-col gap-5">
      <h1 className="font-bold uppercase text-4xl text-center font-mono text-black"> <span className=" text-green-600">Exclusive</span> College Connections</h1>
      {error && <h1 className="text-red-500 mb-4 " >{error}</h1>}

    <div className="">
      <GoogleOAuthProvider clientId="239319897726-57sm2d2cgkbqiuca36hkihq0bpk6skkq.apps.googleusercontent.com">
        <div className="flex justify-center">
          <GoogleLogin
            clientId="239319897726-57sm2d2cgkbqiuca36hkihq0bpk6skkq.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            onFailure={onFailure}
            size="medium"
            width="300"
            shape="square"
            type="standard"
            logo_alignment="left"
            theme="filled_black"
            render={(props) => (
              <button
                onClick={props.onClick}
                disabled={props.disabled}
              ></button>
            )}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
    </div>

  );
};

export default GoogleAuth;
