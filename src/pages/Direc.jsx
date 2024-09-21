import React, { useState, useEffect } from 'react';
import NavbarComponent from '../components/NavbarComponent';
import { io } from 'socket.io-client';

import './Direc.css';


const SocketIOComponent = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000"); // Replace with your socket server URL

    socket.on("FromAPI", data => {
      setResponse(data);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="socket-io-page">
      <NavbarComponent currentPage="socket-io" />
      <div className="socket-io-content">
        <h1>Socket.IO Integration</h1>
        <p>Socket.IO Response: {response}</p>
      </div>
    </div>
  );
}

export default SocketIOComponent;
