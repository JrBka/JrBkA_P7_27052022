import React from "react";
import styled from "styled-components";
import Headers from "../components/home/header-home";
import logColor from "../style/color-style";

const Div = styled.div`
  border: 5px solid ${logColor.secondary};
  border-radius: 20px;
`;

const Home = () => {
  return (
    <Div>
      <Headers />
    </Div>
  );
};

export default Home;
