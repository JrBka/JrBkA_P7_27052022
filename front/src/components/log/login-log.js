import React from "react";
import Axios from "axios";
import styled from "styled-components";
import color from "../../style/color-style";

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.input`
  width: 150px;
  height: 30px;
  font-weight: bold;
  border-radius: 50px;
  border: inherit;
  color: ${color.tertiary};
  &:hover {
    color: black;
    box-shadow: ${color.tertiary} 3px 3px 10px;
    cursor: pointer;
  }
`;

const ErrorColor = styled.p`
  display: flex;
  text-align: center;
  color: ${color.primary};
`;

function Login({ email, setEmail, password, setPassword }) {
  const handleLogin = (e) => {
    e.preventDefault();

    const getError = document.getElementById("error");

    Axios({
      method: "post",
      url: "http://localhost:5000/api/user/login",
      withCredentials: true,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        console.log(res.data.profil[0]);
        window.location = "/home";
      })
      .catch((error) => {
        getError.innerHTML = "Email ou Mot de pass invalide";
      });
  };
  return (
    <Modal>
      <h1>Connexion</h1>
      <br />
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "0 0 20px 0" }}
      />
      <br />
      <br />
      <label htmlFor="password">Mot de passe</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <ErrorColor id="error"></ErrorColor>
      <br />
      <form id="login-form" action="" onSubmit={handleLogin}>
        <Button type="submit" value="Se connecter" />
      </form>
    </Modal>
  );
}

export default Login;
