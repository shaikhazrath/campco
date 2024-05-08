"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../globals.css";
import axios from "axios";
import BottomNavBar from "@/components/BottomNavBar";
export default function RootLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const chechauth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
        }
        const config = {
          headers: {
            Authorization: token,
          },
        };
        await axios.get(`${process.env.NEXT_PUBLIC_URL}/user/checkauth`, config);
      } catch (error) {
        // setAuthenticated(false)
        console.log(error)
        if (
          error.response.data.message === "Failed to authenticate token" ||
          error.response.data.message === "User not found"
        ) {
          localStorage.removeItem("token");
          router.push("/auth");
        }
      }
    };
    chechauth();
    setLoading(false);
  }, [router]);
  if (loading) {
    return (
    <html lang="en">
    <h1>loading...</h1>;
    </html>
    )
  }
  return (
    <html lang="en">
      <body className="">
      <div className="flex flex-col h-screen">
      <main className="flex-grow">{children}</main>
      <BottomNavBar />
    </div>
      </body>
    </html>

  );
}
