import React, { useState } from "react";
import Signup from "./signup";
import Login from "./login";
function Log() {
  const [signupModal, setSignupModal] = useState(true);
  const [loginModal, setLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleModals = (e) => {
    if (e.target.id === "signup") {
      setSignupModal(true);
      setLoginModal(false);
    }
    if (e.target.id === "login") {
      setSignupModal(false);
      setLoginModal(true);
    }
  };

  return (
    <div>
      <ul>
        <li id="signup" onClick={handleModals}>
          S'inscire
        </li>
        <li id="login" onClick={handleModals}>
          Se connecter
        </li>
      </ul>
      {signupModal && <Signup />}
      {loginModal && (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      )}
    </div>
  );
}

export default Log;
