import React, { useState } from "react";
import Signup from "./signup-log";
import Login from "./login-log";
import logColors from "../../style/color-style";
import styled from "styled-components";
import image from "../../logo/icon-modif.png";

// composant stylisé
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  color: white;
`;

const NavBar = styled.ul`
  width: 350px;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0;
  background-color: ${logColors.primary};
  border: 1px solid black;
  border-bottom: none;
`;

const ModalLog = styled.div`
  width: 350px;
  height: 500px;
  display: flex;
  justify-content: center;
  margin: 0;
  background-color: ${logColors.primary};
  border: 1px solid black;
  border-top: inherit;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;
function Log() {
  // state
  const [signupModal, setSignupModal] = useState(false);
  const [loginModal, setLoginModal] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [boxShadowSignup, setBowShadowSignup] = useState(
    "inset 3px -3px 10px black"
  );
  const [boxShadowLogin, setBoxShadowLogin] = useState(null);
  const [colorSignup, setColorSignup] = useState("black");
  const [colorLogin, setColorLogin] = useState("");

  const NavBarLogLogin = styled.li`
    width: 50%;
    height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    box-shadow: ${boxShadowLogin};
    margin-top: -5px;
    color: ${colorLogin};
    &:hover {
      z-index: 2;
      cursor: pointer;
      color: black;
    }
  `;

  const NavBarLogSignup = styled.li`
    width: 50%;
    height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    box-shadow: ${boxShadowSignup};
    margin-top: -5px;
    color: ${colorSignup};
    &:hover {
      z-index: 2;
      cursor: pointer;
      color: black;
    }
  `;

  // Affiche le formulaire d'inscription ou de connexion
  const handleModals = (e) => {
    if (e.target.id === "signup") {
      setSignupModal(true);
      setLoginModal(false);
      setBowShadowSignup("");
      setBoxShadowLogin("inset -3px -3px 10px black");
      setColorLogin("black");
      setColorSignup("");
    }
    if (e.target.id === "login") {
      setSignupModal(false);
      setLoginModal(true);
      setBowShadowSignup(`inset 3px -3px 10px black;`);
      setBoxShadowLogin("");
      setColorLogin("");
      setColorSignup("black");
    }
  };
  return (
    <PageContainer>
      <header>
        <Image src={image} alt="Logo Groupomania" />
      </header>
      <NavBar>
        <NavBarLogLogin id="login" onClick={handleModals}>
          Se connecter
        </NavBarLogLogin>
        <NavBarLogSignup id="signup" onClick={handleModals}>
          S'inscire
        </NavBarLogSignup>
      </NavBar>

      {loginModal && (
        <ModalLog>
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        </ModalLog>
      )}
      {signupModal && (
        <ModalLog>
          <Signup
            pseudo={pseudo}
            setPseudo={setPseudo}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        </ModalLog>
      )}
    </PageContainer>
  );
}

export default Log;
