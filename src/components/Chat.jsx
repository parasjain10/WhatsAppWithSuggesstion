import "firebase/firestore";
import React, { useContext, useState } from "react";

import Messages from "./Messages";
import Input from "./Input";

import { ChatContext } from "../context/ChatContext";
import Web from "../img/WebChat.webp";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [suggestions, setSuggestions] = useState({});

  return (
    <>
      {data?.chatId !== "null" ? (
        <div className="chat">
          <div className="chatInfo">
            <div className="info">
              <img src={data.user.photoURL} alt="" />
              <span>{data.user?.displayName}</span>
            </div>
          </div>
          <Messages suggestions={suggestions} setSuggestions={setSuggestions} />
          <Input suggestions={suggestions} setSuggestions={setSuggestions} />
        </div>
      ) : (
        <div className="chat">
          <div className="emptyChat">
            <img src={Web} alt="initial Chat UI" />
            <h1>Whatsapp Web</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
