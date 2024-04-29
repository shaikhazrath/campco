import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";

const Notifications = () => {
  const [requestedUsers, setRequestedUsers] = useState([]);

  useEffect(() => {
    const fetchRequestedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: token,
          },
        };
        const res = await axios.get("http://localhost:9000/user/viewRequests", config);
        setRequestedUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequestedUsers();
  }, []);

  const handleAcceptRequest = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.get(`http://localhost:9000/user/acceptRequest/${userId}`, config);
      const updatedUsers = requestedUsers.filter((user) => user._id !== userId);
      setRequestedUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Requested Users</h1>
      <ul>
        {requestedUsers.map((user) => (
          <li key={user._id}>
            {user.name}{" "}
            <button onClick={() => handleAcceptRequest(user._id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
