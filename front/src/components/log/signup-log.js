import React from "react";
import Axios from "axios";
import styled from "styled-components";
import color from "../../style/color-style";

// composant stylisé

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

// inscription dans l'application
function Signup({ pseudo, setPseudo, email, setEmail, password, setPassword }) {
  const handleSignup = (e) => {
    const pseudoError = document.getElementById("pseudoError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    e.preventDefault();

    Axios({
      method: "post",
      url: "http://localhost:5000/api/user/signup",
      withCredentials: true,
      data: {
        pseudo,
        email,
        password,
      },
    })
      .then((res) => {
        alert(res.data.message);
        window.location = "/";
      })
      .catch((error) => {
        const errors = error.response.data;

        // gestion des messages d'erreurs
        if (
          errors.message === "Pseudo déjà utilisé" ||
          errors.error === "Pseudo invalide"
        ) {
          return (pseudoError.innerHTML = "Pseudo déjà utilisé ou invalide");
        } else {
          pseudoError.innerHTML = "";
        }

        if (
          errors.message === "Email déjà utilisé" ||
          errors.error === "Email invalide"
        ) {
          return (emailError.innerHTML = "Email invalide ou déjà utilisé");
        } else {
          emailError.innerHTML = "";
        }

        if (errors.error === "Mot de pass invalide !") {
          return (passwordError.innerHTML =
            "Le mot de passe doit contenir au minimum 8 caractères, une majuscule et deux chiffres");
        } else {
          passwordError.innerHTML = "";
        }
      });
  };
  return (
    <Modal>
      <h1>Inscription</h1>
      <br />
      <form id="signup-form" onSubmit={handleSignup}>
        <label htmlFor="pseudo">Pseudo</label>
        <br />
        <input
          type="text"
          name="pseudo"
          id="pseudo"
          placeholder="olivier155"
          onChange={(e) => setPseudo(e.target.value)}
        />
        <ErrorColor id="pseudoError"></ErrorColor>
        <br />
        <br />
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="olivier155@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <ErrorColor id="emailError"></ErrorColor>

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
        <ErrorColor id="passwordError"></ErrorColor>
        <br />

        <br />
        <Button type="submit" value="S'inscrire" />
      </form>
    </Modal>
  );
}

export default Signup;
