import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { idContext } from "../appContext";
import logColor from "../../style/color-style";
import FormData, { _boundary } from "form-data";

const ImgProfil = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  overflow: hidden;
`;

const DivError = styled.div`
  color: ${logColor.primary};
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

  const updateProfil = (e) => {
    e.preventDefault();
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
    //bodyFormData.append("pseudo", newPseudo);
    bodyFormData.append("image", newPhoto);
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
        console.log(data);
        console.log(newPhoto);
        alert("Modification réussi");
        window.location = "/home";
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    <div>
      <form action="" onSubmit={updateProfil}>
        <div>
          <p>pseudo: {pseudo}</p>
          <input
            id="newPseudo"
            type="text"
            placeholder="modifier votre pseudo"
            onChange={(e) => (newPseudo = e.target.value)}
          />
        </div>
        <div>
          <p>email: {email}</p>
          <input
            type="email"
            placeholder="modifier votre email"
            onChange={(e) => (newEmail = e.target.value)}
          />
        </div>
        <div>
          <p>password: </p>
          <input
            type="password"
            placeholder="modifier votre password"
            onChange={(e) => (newPassword = e.target.value)}
          />
        </div>
        <div>
          <p>bio: {bio}</p>

          <textarea
            type="text"
            placeholder="modifier votre bio"
            onChange={(e) => (newBio = e.target.value)}
          />
        </div>
        <div>
          <p>photo de profil:</p>
          <ImgProfil src={photo} alt="photo de profil" />
          <br />

          <input
            id=" photoProfil"
            name="photoProfil"
            type="file"
            accept="image/*"
            onChange={(e) => (newPhoto = e.target.value)}
          />
        </div>
        <br />
        <DivError id="error"></DivError>

        <input id="button-updateProfil" type="submit" value="modifier" />
      </form>
      <br />
      <input type="submit" value="Supprimer ce compte" onClick={deleteUser} />
    </div>
  );
}

export default UpdateProfil;
