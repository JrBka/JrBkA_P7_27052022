import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Headers from "../components/home/header-home";
import logColor from "../style/color-style";
import { idContext } from "../components/appContext";
import axios from "axios";

const Div = styled.div`
  border: 5px solid ${logColor.secondary};
  border-radius: 20px;
`;

const Home = () => {
  const [userId, setUserId] = useState("");

  // Vérifie le token à chaque action et renvoi l'userId
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/userId`,
      withCredentials: true,
    }).then((data) => {
      setUserId(data.data.userId);
    });
  }, []);

  return (
    <Div>
      <idContext.Provider value={userId}>
        <Headers />
      </idContext.Provider>
    </Div>
  );
};

export default Home;
