import React from 'react'

import defaultAvatar from '../assets/default avatar.png';

import "./ChatMsg.css"
import { MessageBox } from 'react-chat-elements'

import 'react-chat-elements/dist/main.css';
const ChatMsg = ({user_image, message, name, isUser, a_image}) => {

    
    const user_img = user_image? user_image:defaultAvatar
  return (

    <div style={{ marginBottom: '5px' }}>

    
        <div className={`chat-header ${isUser ? 'right' : 'left'}`}>
            <img src={user_img} className="chat_img" alt="User Avatar" />
        <strong>{name}</strong>
      </div>

        {a_image && <MessageBox
            position={isUser?'right':'left'}
            type={'photo'}
            text={message? message:''}
            data={{
                uri: a_image,
                width:180,
                height: 180,
                
              }}
              onOpen ={ () =>{
                
              }}
        />}
        {!a_image && <MessageBox
            position={isUser?'right':'left'}
            type={'text'}
            text={message}
            
        />}
    </div>
  )
}

export default ChatMsg