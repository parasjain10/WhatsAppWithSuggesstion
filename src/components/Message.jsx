import React, { useContext, useEffect, useRef } from "react";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  const currentDateTime = message.date.toDate();
  const today = new Date();
  let formattedDateTime;

  if (
    currentDateTime.getDate() === today.getDate() &&
    currentDateTime.getMonth() === today.getMonth() &&
    currentDateTime.getFullYear() === today.getFullYear()
  ) {
    formattedDateTime = currentDateTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else {
    formattedDateTime = currentDateTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  useEffect(() => {
    window.screenTop = 0;
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        <div className="actualMessage">
          <div className="myName">
            <span>
              {message.senderId === currentUser.uid
                ? currentUser?.displayName
                : data.user.displayName}
            </span>
          </div>
          <span id="msg">{message.text}</span>
          <div className="time">
            <span>{formattedDateTime}</span>
          </div>
        </div>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
