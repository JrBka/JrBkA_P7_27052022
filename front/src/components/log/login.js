import React from "react";
import Axios from "axios";

function login({ email, setEmail, password, setPassword }) {
  const handleLogin = (e) => {
    e.preventDefault();

    const emailError = document.getElementById("email_error");
    const passwordError = document.getElementById("password_error");

    Axios({
      method: "post",
      url: "http://localhost:5000/api/user/login",

      data: {
        email,
        password,
      },
    })
      .then((res) => {
        window.location = "/home";
      })
      .catch((error) => {
        if (error.response.status == 401) {
          emailError.innerHTML = error.response.data.message;
        }
        if (error.response.status == 400) {
          passwordError.innerHTML = error.response.data.message;
        }
      });
  };
  return (
    <div>
      <h1>Connexion</h1>
      <br />
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div id="email_error"></div>
      <br />
      <label htmlFor="password">Mot de passe</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div id="password_error"></div>
      <form id="login-form" action="" onSubmit={handleLogin}>
        <br />
        <input type="submit" value="Se connecter" />
      </form>
    </div>
  );
}

export default login;
