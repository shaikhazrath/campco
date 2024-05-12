"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { IoIosArrowBack, IoMdSend } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BsThreeDotsVertical } from "react-icons/bs";

const Chat = ({ params }) => {
  const recId = params.id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    // Scroll to bottom when messages update
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io(`${process.env.NEXT_PUBLIC_URL}`, {
      auth: {
        token: token,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/user/userChat/${recId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data.messages);
        console.log(response.data.messages)
        setRecipient(response.data.recipient);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recId]);
  const sendMessage = () => {
    if (socket && newMessage.trim() !== "") {
      socket.emit("chat", { recipientId: recId, messageText: newMessage });
      setNewMessage("");
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("messageReceived", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);
  if (loading) {
    return <h1>loading....</h1>;
  }
  return (
    <div className=" bg-background text-white text-sm flex flex-col h-screen justify-between ">
      {recipient && 
      <nav className="flex w-full items-center gap-5 bg-foreground px-10 h-16">
        <Link href="/Chat">
          <IoIosArrowBack />
        </Link>
        <Link href="/Profile" className="w-full">
          <h1 className=" text-base font-bold text-center">{recipient.name}</h1>
        </Link>
      </nav>
}
      {/* messages */}
    
      <div className=" h-screen  overflow-scroll">
      {messages &&   messages.map((message, index) => (
        <div  key={index}>
{message.recipient === recId ? (
        <div className=" w-1/2 bg-blue-600 m-5 rounded-2xl p-3 rounded-bl-none">
          <h1>
          {message.message}
          </h1>
        </div>
         ) : (
        <div className=" w-1/2 bg-white text-black m-5 rounded-2xl p-3 rounded-br-none ml-auto">
          <h1>
          {message.message}
          </h1>
        </div>
          )}
        </div>

      ))}
      <div ref={scrollRef} />
      </div>

      {/* input */}
      <div class="">
        <div class="relative  text-white">
          <div
            contenteditable="true"
            role="textbox"
            class="bg-foreground rounded-none border-gray-300 p-2  h-16 max-h-24  overflow-y-scroll focus:outline-none resize-none pr-16 text-white"
            placeholder="Type a message..."
          ></div>
          <button class="absolute top-1 right-0 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 focus:outline-none rounded-none">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
