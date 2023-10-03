import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import logout from "../img/icons8-logout-48.png";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="profileImage" />
        <span>{currentUser.displayName}</span>
      </div>
      <img
        src={logout}
        alt="logout"
        onClick={() => {
          dispatch({ type: "EMPTY_USER" });
          signOut(auth);
        }}
      />
    </div>
  );
};

export default Navbar;
