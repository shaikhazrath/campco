"use client";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
const Upload = () => {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/posts/uploadPosts`,
        { post },
        config
      );
      router.push('/')
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <NavBar />
      <div className="flex justify-center">
        <div className="flex mt-8 flex-col gap-4 px-5 h-screen w-full  md:w-1/3">
          <Textarea
            className="w-full  focus:outline-none focus:ring-0  border-none text-white text-lg max h-1/3 resize-none focus-visible:ring-0 focus-visible:ring-ring -visible:ring-offset-0"
            placeholder="What's happening?"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            maxLength={300}
            rows={4}
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md text-lg"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Loading" : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
