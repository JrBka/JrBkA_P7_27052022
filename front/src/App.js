import React, { useEffect, useState } from "react";
import Routes from "./components/routes/index-routes";
import { idContext } from "./components/appContext";
import axios from "axios";

const App = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/userId`,
      withCredentials: true,
    }).then((data) => {
      setUserId(data.data.userId);
    });
  });

  return (
    <idContext.Provider value={userId}>
      <Routes />
    </idContext.Provider>
  );
};

export default App;
