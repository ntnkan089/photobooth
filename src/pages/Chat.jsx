import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

import NavbarComponent from '../components/NavbarComponent';
import './Chat.css'

import ChatMsg from '../components/ChatMsg';
import { Reply  } from 'lucide-react';

import { X } from 'lucide-react';

import { Image } from 'lucide-react';

const socket = io('https://photo-server-deplo.onrender.com');
const Chat = () => 
    
        {

    const [previewPostImg, setPreviewPostImg] = useState(null);
    const { userId } = useParams(); 
    const [room, setRoom] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const token = sessionStorage.getItem('token')
    const [messageInput, setMessageInput] = useState('');

    let isUser = false
    const fileInputRef = useRef(null);


    const chatEndRef = useRef(null)
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior:'smooth'});
      }, [chatMessages]);
    useEffect(() => {
        socket.connect();

        if (userId && room && room?._id) {
            socket.emit('join', room?._id);
        }

        return () => {
            socket.emit('leave', room?._id);
            socket.disconnect();
        };
    }, [userId, room]);
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomResponse = await fetch(`https://photo-server-deplo.onrender.com/dir-mes/room/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token 
                    },
                });
                const roomData = await roomResponse.json();
                setRoom(roomData);
                socket.emit('join', roomData._id);

            } catch (error) {
                console.error('e fetching room:', error);
                setRoom({ error: 'e fetch room' }); // Set room state to an error object
            }
        };

        const fetchChatMessages = async () => {
            try {
                const chatResponse = await fetch(`https://photo-server-deplo.onrender.com/dir-mes/chat/${room._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                });
                const chatData = await chatResponse.json();
                setChatMessages(chatData);
            } catch (error) {
                console.error('e fetching chat messages:', error);
            }
        };

        
        if (userId) {
            fetchRoom();
            fetchChatMessages();
        }

        return () =>{
            socket.disconnect();
        }
    }, [userId, room?._id]); 

    useEffect(() => {
        socket.on('message', (newMessage) => {
          setChatMessages([...chatMessages, newMessage]);
        });

    
        return () => {
          socket.off('message');
        };
      }, [chatMessages]);
      
  const sendMessage = async (e) => {
    e.preventDefault();

    const a = room?.user0.user_id === sessionStorage.getItem('user_id')?room?.user0 : room.user1;
    const a0 = room?.user0.user_id === sessionStorage.getItem('user_id')?room?.user1 : room.user0;
    let res = null;
    if(previewPostImg){
       
        let url = "https://photo-server-deplo.onrender.com/uploa-chat";

        let formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        const res_w = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        body: formData
        });
        res = await res_w.json();
        fileInputRef.current.value = null;
    }
    if((previewPostImg&&res)||(!previewPostImg&&messageInput)){
        socket.emit('message', {
            roomId: room?._id,
            from: a,
            to: a0,
            message: messageInput?messageInput:null,
            image: res?res.name:null,
            
          });
    }
    
    setMessageInput('');
    setPreviewPostImg(null);
  };

  let a0 = !room?"": (room?.user0.user_id === sessionStorage.getItem('user_id')?room?.user1.user_name : room.user0.user_name)
  
  
  
  const bac = () => {
  
    window.location.href = `/profile/${userId}`
  }
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {

    const file = event.target.files[0];
    if (file) {
        setPreviewPostImg(URL.createObjectURL(file));
    }
};

    return (
        <>
        <NavbarComponent currentPage="posts" />
        
        <div className='chat'>
           
            

            <div className='chat0'>
                <Reply className='bac' onClick ={bac} size = {38} />  
                <h2 className='heade'>Chat With <strong className="username">{a0}</strong> ✋</h2>
                <ul className='lis'>
                

                        {chatMessages.map((message) => {
                       console.log(message);
                        isUser  = message.user_from.user_id ===sessionStorage.getItem('user_id');
                        return (
                        <li key={message._id} style = {{listStyle: 'none'}}>
                            <ChatMsg 
                            user_image={message.user_from.user_image}
                            name={message.user_from.user_name}
                            message={message.chat_message}
                            isUser={isUser}
                            a_image = {message.chat_image}
                            />
                        </li>
                        );
                    })}
                </ul>
            </div>
            {previewPostImg != null && (
                <div className="image-preview-container">
                    <X className='close' onClick={()=>setPreviewPostImg(null)}/>
                    <p>Image preview:</p>
                    <br />
                    <img src={previewPostImg} className="preview-post-img" />
                </div>
            )}
            <div className="chat-divide"/>
            <div ref={chatEndRef} />

            <form onSubmit={sendMessage} className='chat-input-container'>
                <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}  id='aImg' name= "aImg" onChange={handleFileChange}/>   
                <button onClick={sendMessage} disabled={!messageInput&&!previewPostImg}>Send</button>
                
                <Image className ='img_z'  size={53} onClick={handleImageClick}>
                    
                </Image>
            </form>
        </div>
        </>
    );
};

export default Chat;