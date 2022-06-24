import React, { useEffect } from "react";
import styled from "styled-components";
import Headers from "../components/home/header-home";
import logColor from "../style/color-style";
import { idContext } from "../components/appContext";
import axios from "axios";

const Div = styled.div`
  border: 5px solid ${logColor.primary};
  border-radius: 20px;
`;

const Home = () => {
  let dataUser = [];
  // Vérifie le token et renvoi l'userId et le privilege
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/userId`,
      withCredentials: true,
    }).then((data) => {
      dataUser.push(data.data.userId, data.data.userPrivilege);
    });
  }, []);

  return (
    <Div>
      <idContext.Provider value={dataUser}>
        <Headers />
      </idContext.Provider>
    </Div>
  );
};

export default Home;
