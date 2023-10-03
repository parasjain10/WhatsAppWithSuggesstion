import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import Message from "./Message";

import axiosInstance from "../axiosInstance";
import {
  getChatGPTResponsePayload,
  getMessagesWithoutDigitsAndQuotes,
} from "../util";

const Messages = ({ suggestions, setSuggestions }) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages.reverse());
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    if (messages.length > 0) {
      const payload = getChatGPTResponsePayload(messages);
      if (
        currentUser.uid !== messages[0].senderId &&
        data.chatId.includes(currentUser.uid) &&
        data.chatId.includes(messages[0].senderId)
      ) {
        axiosInstance
          .post("", payload)
          .then((response) => {
            setSuggestions(() => {
              const str = response.data.choices[0]?.message?.content.replaceAll(
                /"/g,
                ""
              );
              const splitMessages = str.split("\n");

              const messagesWithoutDigitsAndQuotes =
                getMessagesWithoutDigitsAndQuotes(splitMessages);

              return {
                isClicked: false,
                suggest: messagesWithoutDigitsAndQuotes,
              };
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }

    return () => {
      setSuggestions({});
    };
  }, [currentUser.uid, data.chatId, messages, setSuggestions]);

  const handleSuggestion = async (i) => {
    setSuggestions((prev) => {
      return {
        ...prev,
        isClicked: true,
        which: i,
      };
    });
  };

  return (
    <div className="messages">
      {messages?.map((m) => (
        <Message message={m} key={m.id} />
      ))}
      <div className="allS">
        {suggestions?.suggest?.map((s, i) => (
          <div
            className="suggestion"
            onClick={() => handleSuggestion(i)}
            key={s + i}
          >
            <p>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
