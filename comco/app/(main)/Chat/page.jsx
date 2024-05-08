'use client'
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React,{useState,useEffect} from "react";
import {IoMdSearch} from "react-icons/io";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
const InBox = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredUsers = connectedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const fetchConnectedUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/user/inbox`,
          config
        );
        setConnectedUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching connected users:", error);
        setLoading(false);
      }
    };

    fetchConnectedUsers();
  }, []);
  const handleChatClick = (userId) => {
      router.push(`/Chat/${userId}`);

  };
if(loading){
  return <h1>loading....</h1>
}
  return (
  <>
  <div className=" ">
  <NavBar/>
  </div>
  <div className="flex justify-center flex-col w-full  md:items-center">

  <div className=" md:w-1/4">

    <div className="p-5 ">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoMdSearch className=" text-black" size={20} />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="bg-primary pl-10 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
        />
      </div>
    </div>
    {filteredUsers.length === 0 ? (
      <div className="px-5 mt-3 text-white">
        No users found with that name
      </div>
    ) : (
      filteredUsers.map((user, index) => (
        <div key={index} style={{ cursor: "pointer" }}>
          <div
            className="flex gap-5 items-center px-5 mt-3"
            onClick={() => handleChatClick(user._id)}
          >
            <Avatar className="h-14 w-14">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-white font-bold">{user.name}</h1>
              <div className="flex items-center justify-center gap-5 align-middle">
                <h1 className="text-gray-400 font-medium text-sm">
                  New Message
                </h1>
                <h1 className="text-gray-400 font-normal text-sm">
                  2:30PM
                </h1>
              </div>
            </div>
          </div>
          <div className="h-[0.5px] w-full bg-gray-600 mt-4 mb-4"></div>
        </div>
      ))
    )}
  </div>
  </div>

    </>
  );
};

export default InBox;
