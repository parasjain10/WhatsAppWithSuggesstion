import React, { useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = ({ searchedUser, setSearchedUser }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (userInfo, chatId) => {
    setSelectedChat(chatId);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  const handleSelectUser = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > searchedUser.uid
        ? currentUser.uid + searchedUser.uid
        : searchedUser.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: searchedUser.uid,
            displayName: searchedUser.displayName,
            photoURL: searchedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", searchedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setSearchedUser(null);
    // setUsername("");
  };

  return (
    <>
      {searchedUser === null ? (
        <div className="chats">
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat, i) => (
              <div
                className={`userChat ${
                  chat[0] === selectedChat ? "selected" : ""
                }`}
                key={chat[0]}
                onClick={() => {
                  handleSelect(chat[1]?.userInfo, chat[0]);
                }}
              >
                <img src={chat[1]?.userInfo?.photoURL} alt="" />
                <div className="userChatInfo">
                  <span>{chat[1]?.userInfo?.displayName}</span>
                  <p>{chat[1]?.lastMessage?.text}</p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="chats">
          <div className="userChat" onClick={handleSelectUser}>
            <img src={searchedUser.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{searchedUser.displayName}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
