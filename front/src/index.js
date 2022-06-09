import React from "react";
import ReactDOM from "react-dom/client";
import color from "./style/color-style";

import App from "./App";
import styled from "styled-components";

const GlobalStyle = styled.div`
  font-family: Lato, sans-serif;
  margin: 10px;
  color: ${color.tertiary};
  min-width: 300px;
`;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalStyle>
    <App />
  </GlobalStyle>
);
