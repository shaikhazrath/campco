"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../globals.css";
import axios from "axios";
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
        await axios.get("http://localhost:9000/user/checkauth", config);
      } catch (error) {
        // setAuthenticated(false)
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
    return <h1>loading...</h1>;
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}