'use client'
import NavBar from "@/components/NavBar";
import React, { useEffect ,useState,useRef} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import BottomNavBar from "@/components/BottomNavBar";
const Posts = () => {
  const [posts, setPosts] = useState(null);
  const getPosts = async()=>{
    try {
      const token = localStorage.getItem("token");

      const config = {
          headers: {
            Authorization: token,
          },
        };
    const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/posts`,config); 
   setPosts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
getPosts()
  },[])

  const scrollContainerRef = useRef(null);
  const [scroll, setScroll] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const currentScrollPosition = scrollContainerRef.current.scrollTop;
  
  
        if (currentScrollPosition <= scrollValue) {
          setScroll(false);
      setScrollValue(currentScrollPosition);

        } else {
          setScroll(true);
      setScrollValue(currentScrollPosition);

        }
      }
    };
  
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
  
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [scrollValue,scrollContainerRef]);

  return (
    <div >

      <NavBar />

<BottomNavBar scrolling={scroll}/>
      <div ref={scrollContainerRef} className=" h-screen overflow-scroll ">

        {/* <div className="flex flex-row justify-center items-center px-4 pt-4 gap-3 ">
          <div className="w-full  md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoMdSearch className=" text-black" size={20} />
              </div>
              <Input
                type="text"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="bg-primary pl-10 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              />
            </div>
          </div>
        
        </div> */}
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {posts &&
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-foreground rounded-lg shadow-lg overflow-hidden "
              >
                <div className="p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2 border-b border-b-gray-800 pb-4">
                    <div className="flex items-center">
                      <Avatar className="mr-4 w-10 h-10">
                        <AvatarImage
                          src={post.user.profileImage}
                          alt={post.user.name}
                        />
                      </Avatar>
                      <h3 className="text-white font-medium text-sm mr-2">
                        {post.user.name}
                      </h3>
                    </div>

                  </div>

                  <div>
                    <p className="text-gray-300">{post.posts}</p>
                    <span className="text-sm text-gray-400">
                      {
                        new Date(post.DateAndTime)
                          .toLocaleString()
                          .split(",")[0]
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
