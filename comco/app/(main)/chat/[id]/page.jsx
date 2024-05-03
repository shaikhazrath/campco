"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [socket, setSocket] = useState(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("https://fromloop.vercel.app", {
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
          `https://fromloop.vercel.app/user/userChat/${recId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data.messages);
        setRecipient(response.data.recipient.name);
        setLoading(false);
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
  
    <div className="bg-background w-full h-screen flex flex-col ">
      {/* topbar */}
      <div className="pt-5 px-5 flex items-center justify-between">
        <div className="flex justify-center items-center gap-10">
          <Link href="/">
            <IoIosArrowBack color="white" size={30} />
          </Link>
          <Link
            href="/Profile"
            className="flex bg-foreground px-8 py-2 text-white rounded-3xl justify-between gap-4 text-xl font-bold items-center"
          >
            <Avatar className="inline-block">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>{recipient}</h1>
          </Link>
        </div>
        <div>
          <BsThreeDotsVertical color="white" size={30} />
        </div>
      </div>

      {/* chat area */}
      <div className="flex-grow overflow-y-auto p-5 ">
        {/* messages go here */}
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          <div>
            {messages &&
              messages.map((message, index) => (
                <div key={index}>
                  {message.recipient === recId ? (
                    <div className="bg-gray-200 p-3 rounded-lg rounded-br-none  ml-auto w-max m-3 max-w-xs ">
                      <p>{message.message}</p>
                    </div>
                  ) : (
                    <div className="bg-blue-500 text-white p-3 rounded-lg rounded-bl-none w-max">
                      <p>{message.message}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* input area */}
      <div className="flex items-center p-5 gap-5  ">
        <Textarea
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send Message....."
          className="flex min-h-[50px] w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 text-white"
        />
        <Button className="bg-green-400" onClick={sendMessage}>
          <IoMdSend size={25} />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
