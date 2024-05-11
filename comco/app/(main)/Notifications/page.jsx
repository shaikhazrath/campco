"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Search = () => {
  const [people, setPeople] = useState(null);
  const [requests, setRequests] = useState(null);

  const fetchpeople = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: token,
        },
      };
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/user/findpeople`,
        config
      );
      console.log(res)
      setPeople(res.data);

    } catch (error) {
      console.error("Error fetching random user:", error);
    }
  };
  useEffect(() => {
    fetchpeople();
  }, []);

  return (
    <div className=" text-primary">
      <NavBar />
      {people ? (
        <>
       {people.requests && people.requests.length !== 0 && (
  <h1 className=" text-center pt-5 font-bold  uppercase">Your Requests</h1>
)}
          { people.requests.map((r, index) => (
            <div key={index} className="flex justify-center">
              <Link
                href={`/Profile/${r._id}`}
                className="flex gap-10 items-center bg-foreground m-5 rounded-xl px-10 py-3 "
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={r.profileImage} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold tracking-wider">
                    <span style={{ textTransform: "capitalize" }}>
                      {r.name.charAt(0)}
                    </span>
                    {r.name.slice(1)}
                  </h1>
                  <div className=" flex gap-5">
                    <h1 className=" text-sm tracking-wider">{r.branch}</h1>
                  </div>
                </div>
              </Link>
            </div>
          ))}
                 {people.usersToConnect && people.usersToConnect.length !== 0 && (
  <h1>Connect with this people</h1>
)}
          {people.usersToConnect.map((p, index) => (
            <div key={index} className="flex justify-center">
              <Link
                href={`/Profile/${p._id}`}
                className="flex gap-10 items-center bg-foreground m-5 rounded-xl px-10 py-3 "
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold tracking-wider">
                    <span style={{ textTransform: "capitalize" }}>
                      {p.name.charAt(0)}
                    </span>
                    {p.name.slice(1)}
                  </h1>
                  <div className=" flex gap-5">
                    <h1 className=" text-sm tracking-wider">{p.branch}</h1>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </>
      ) : (
        <p className="text-white ">No user fetched yet</p>
      )}
    </div>
  );
  
};

export default Search;
