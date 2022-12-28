import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

const UserContext = createContext("");
function UserProvider({ children }) {
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .post(
        "http://localhost:8080/api/v1/admin/user/search",
        {
          textSearch: "string",
          active: true,
          role: "ROLE_ADMIN",
          pageReq: {
            page: 0,
            pageSize: 0,
            sortField: "string",
            sortDirection: "string",
          },
        },
        { headers: { "Content-Type": "Application/json" } }
      )
      .then((result) => result.json())
      .then((data) => {
        setData(data.data);
      });
  }, [setData]);

  const value = {
    data,
    category,
    setCategory,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserProvider, UserContext };
