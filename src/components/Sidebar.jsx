import React, { useState } from "react";

import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  return (
    <div className="sidebar">
      <Navbar />
      <Search user={user} setUser={setUser} />
      <Chats searchedUser={user} setSearchedUser={setUser} />
    </div>
  );
};

export default Sidebar;
