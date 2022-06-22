import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import styled from "styled-components";
import logColor from "./style/color-style";

const GlobalStyle = styled.div`
  font-family: Lato, sans-serif;
  margin: auto;
  color: ${logColor.tertiary};
  min-width: 300px;
  max-width: 1080px;
  width: 90vw;
`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalStyle>
    <App />
  </GlobalStyle>
);
