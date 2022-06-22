import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { idContext } from "../appContext";
import logColor from "../../style/color-style";
import FormData from "form-data";

// composant stylisé

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: auto;
`;

const DivInput = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ImgProfil = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  overflow: hidden;
`;

const DivError = styled.div`
  color: ${logColor.primary};
`;

const Span = styled.span`
  font-weight: bold;
`;

const P = styled.p`
  width: 80%;
  word-break: break-word;
`;

const Input = styled.input`
  margin: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border: 2px solid ${logColor.tertiary};
  margin-top: 30px;
  max-width: 350px;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

let newPseudo = null;
let newEmail = null;
let newBio = null;
let newPhoto = null;
let newPassword = null;

function UpdateProfil() {
  const id = useContext(idContext);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");

  //Profil utilisateur
  const GetProfil = () => {
    useEffect(() => {
      axios({
        method: "get",
        url: `http://localhost:5000/api/user/${id}`,
        withCredentials: true,
      }).then((data) => {
        setPseudo(data.data.pseudo);
        setEmail(data.data.email);
        setBio(data.data.bio);
        setPhoto(data.data.photo);
      });
    });
  };
  GetProfil();

  // modification du profil utilisateur
  const UpdateProfil = (e) => {
    e.preventDefault();

    //recherche d'éléments dans le DOM
    const pseudoError = document.getElementById("pseudoError");

    const emailError = document.getElementById("emailError");

    const passwordError = document.getElementById("passwordError");

    const bioError = document.getElementById("bioError");

    const photoError = document.getElementById("photoError");

    const pseudo = document.getElementById("pseudo");

    const email = document.getElementById("email");

    const password = document.getElementById("password");

    const bio = document.getElementById("bio");

    if (
      newPseudo == null &&
      newBio == null &&
      newEmail == null &&
      newPassword == null &&
      newPhoto == null
    ) {
      const error = document.getElementById("error");
      return (error.innerHTML = "<p>Veuillez modifiez un élément</p>");
    }

    const bodyFormData = new FormData();
    bodyFormData.append("id", id);
    if (newPseudo != null) {
      bodyFormData.append("pseudo", newPseudo);
    }
    if (newPassword != null) {
      bodyFormData.append("password", newPassword);
    }
    if (newEmail != null) {
      bodyFormData.append("email", newEmail);
    }
    if (newBio != null) {
      bodyFormData.append("bio", newBio);
    }
    if (newPhoto != null) {
      bodyFormData.append("image", newPhoto[0]);
    }

    axios({
      method: "put",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
      data: bodyFormData,
      headers: {
        "Content-Type": `multipart/form-data, boundary${bodyFormData._boundary}`,
      },
    })
      .then((data) => {
        setPseudo(newPseudo);
        setEmail(newEmail);
        setBio(newBio);
        setPhoto(newPhoto);

        if (pseudoError) {
          pseudoError.innerHTML = null;
        }
        if (pseudo.value != null) {
          pseudo.value = null;
        }

        if (emailError) {
          emailError.innerHTML = null;
        }
        if (email.value != null) {
          email.value = null;
        }

        if (passwordError) {
          passwordError.innerHTML = null;
        }
        if (password.value != null) {
          password.value = null;
        }

        if (bioError) {
          bioError.innerHTML = null;
        }
        if (bio.value != null) {
          bio.value = null;
        }

        if (photoError) {
          photoError.innerHTML = null;
        }
        GetProfil();
        alert("Modification réussi");
      })
      .catch((error) => {
        //insertion d'élément dans le DOM
        if (error.response.data.message === "Pseudo invalide") {
          pseudoError.innerHTML = "<p>Pseudo invalide</p>";
        }
        if (error.response.data.message === "Email invalide") {
          emailError.innerHTML = "Email invalide";
        }
        if (error.response.data.message === "Mot de passe invalide") {
          passwordError.innerHTML =
            "Le mot de passe doit contenir au minimum 8 caractères, une majuscule et deux chiffres";
        }
        if (error.response.data.message === "Champs bio vide") {
          bioError.innerHTML = "Bio invalide";
        }
        if (error.response.data.message === "Files vide") {
          photoError.innerHTML = "Photo invalide";
        }
      });
  };

  // supprime le compte de l'utilisateur
  const deleteUser = () => {
    axios({
      method: "delete",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
    })
      .then((data) => {
        console.log(data);

        alert("Utilisateur supprimé");
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Div>
      <Form onSubmit={UpdateProfil}>
        <DivInput>
          <P>
            <Span>Pseudo : </Span>
            {pseudo}
          </P>
          <Label htmlFor="pseudo">Modifiez votre pseudo</Label>
          <br />
          <input
            id="pseudo"
            name="pseudo"
            type="text"
            placeholder="Nouveau pseudo"
            onChange={(e) => (newPseudo = e.target.value)}
            style={{ width: "80%" }}
          />
          <div id="pseudoError" style={{ color: `${logColor.primary}` }}></div>
        </DivInput>
        <DivInput>
          <P>
            <Span>Email : </Span>
            {email}
          </P>
          <Label htmlFor="email">Modifiez votre email</Label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nouvel email"
            onChange={(e) => (newEmail = e.target.value)}
            style={{ width: "80%" }}
          />
          <div id="emailError" style={{ color: `${logColor.primary}` }}></div>
        </DivInput>
        <DivInput>
          <P>
            <Span>Mot de passe : </Span>
            ************
          </P>
          <Label htmlFor="password">Modifiez votre mot de passe</Label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Nouveau mot de passe"
            onChange={(e) => (newPassword = e.target.value)}
            style={{ width: "80%" }}
          />
          <div
            id="passwordError"
            style={{ color: `${logColor.primary}` }}
          ></div>
        </DivInput>
        <DivInput>
          <P>
            <Span>Bio : </Span>
            {bio}
          </P>
          <Label htmlFor="bio">Modifiez votre bio</Label>
          <textarea
            id="bio"
            name="bio"
            type="text"
            placeholder="Nouvelle bio"
            onChange={(e) => (newBio = e.target.value)}
            style={{ width: "80%" }}
          />
          <div id="bioError" style={{ color: `${logColor.primary}` }}></div>
        </DivInput>
        <DivInput>
          <P>
            <Span>Photo de profil: </Span>
          </P>
          <ImgProfil src={photo} alt="photo de profil" />
          <br />
          <Label htmlFor="photo">Modifiez votre photo de profil</Label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={(e) => (newPhoto = e.target.files)}
          />
          <div id="photoError" style={{ color: `${logColor.primary}` }}></div>
        </DivInput>
        <br />
        <DivError id="error"></DivError>

        <Input id="button-updateProfil" type="submit" value="Modifier Profil" />
      </Form>
      <br />
      <br />
      <div>
        <Input type="submit" value="Supprimer ce compte" onClick={deleteUser} />
      </div>
    </Div>
  );
}

export default UpdateProfil;
