"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import InboxCard from "@/components/InboxCard";
import { Input } from "@/components/ui/input";
import { BsThreeDotsVertical } from "react-icons/bs";
import io from "socket.io-client";
import {
  IoIosSettings,
  IoIosNotifications,
  IoMdPersonAdd,
  IoMdSearch,
  IoIosArrowBack,
  IoMdSend,
} from "react-icons/io";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [recId, setRecId] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = connectedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (!loading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768); // Adjust 768 according to your desktop breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatClick = (userId) => {
    if (!isDesktop) {
      router.push(`/chat/${userId}`);
    } else {
      setRecId(userId);
    }
  };

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
    if (recId) {
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
          setRecipient(response.data.recipient.name);
          setLoading(false);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
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
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex">
      {/* sidenavbar */}
      <div className="md:w-1/4 w-full bg-foreground h-screen">
        {/* topnav */}
        <div className="flex justify-between p-5 items-center align-middle">
          {/* setting+user */}
          <div className="relative">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="">
                  {/* Avatar component */}
                  <Avatar className="inline-block">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {/* Settings icon */}
                  <div className=" bg-white w-max rounded-full absolute bottom-0 right-0 text-white">
                    <IoIosSettings size={20} color="black" className="" />
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  <Link href="/profile">
                    <MenubarItem>Profie</MenubarItem>
                  </Link>

                  <Link href="/feedback">
                    <MenubarItem>FeedBack </MenubarItem>
                  </Link>
                  <a onClick={handleLogout}>
                    <MenubarItem>Logout </MenubarItem>
                  </a>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          {/* logo */}
          <div className=" text-white">
            <h1 className=" font-bold uppercase text-xl">fromloop</h1>
          </div>

          {/* addpeople and notifications */}
          <div className="flex gap-2">
            <Link href='/findpeople' className="p-2 bg-white w-max rounded-full">
              <IoMdPersonAdd color="black" size={20} />
            </Link>
            <div className="relative p-2 bg-white w-max rounded-full">
              <IoIosNotifications color="black" size={20} />
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-600"></span>
            </div>
          </div>
        </div>
        <div className="h-[0.5px] w-full bg-gray-600 mb-4"></div>

        {/* search */}
        <div className="px-5">
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
        <div className="h-[0.5px] w-full bg-gray-600 mt-4"></div>

        {/* users */}
        <div className=" h-4/5 overflow-y-auto custom-scroll-bar">
          {/* {connectedUsers.map((user,index) => (
  <div key={index} style={{ cursor: 'pointer'}}>
    <div className="flex gap-5 items-center px-5 mt-3" onClick={() => handleChatClick(user._id)}>
      <Avatar className="h-14 w-14">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-white font-bold">{user.name}</h1>
        <div className="flex items-center justify-center gap-5 align-middle">
          <h1 className="text-gray-400 font-medium text-sm">New Message</h1>
          <h1 className="text-gray-400 font-normal text-sm">2:30PM</h1>
        </div>
      </div>
    </div>
    <div className="h-[0.5px] w-full bg-gray-600 mt-4 mb-4"></div>
  </div>
))} */}

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

      {/* chatroom */}
      {recId ? (
        <div className="bg-background w-full h-screen md:flex flex-col hidden">
          {/* topbar */}
          <div className="pt-5 px-5 flex items-center justify-between">
            <div className="flex justify-center items-center gap-10">
              <a href="/">
                <IoIosArrowBack color="white" size={30} />
              </a>
              <Link
                href={`/profile/${recId}`}
                className="flex bg-foreground px-8 py-2 text-white rounded-3xl justify-between gap-4 text-xl font-bold items-center"
              >
                <Avatar className="inline-block">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
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
                <div ref={messagesEndRef} />
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
      ) : (
        <h1 className=" text-6xl font-extrabold text-center  text-white md:flex hidden justify-center items-center w-full">
          welcome
        </h1>
      )}
    </div>
  );
};

export default Home;
