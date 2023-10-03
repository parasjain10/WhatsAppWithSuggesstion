import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import searchIcon from "../img/search.png";

const Search = ({ user, setUser }) => {
  const [err, setErr] = useState(false);

  const handleSearch = async (usernames) => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", usernames)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }

    if (!usernames) {
      setUser(null);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <img src={searchIcon} alt="" height={15} width={15} />
      </div>
      {err && <span>User not found!</span>}
    </div>
  );
};

export default Search;
