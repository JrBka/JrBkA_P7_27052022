import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { idContext } from "../appContext";
import logColor from "../../style/color-style";
import FormData from "form-data";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: auto;
`;

const DivInput = styled.div`
  margin-left: 20px;
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
  width: 100%;
`;

const Input = styled.input`
  margin: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border: 2px solid ${logColor.tertiary};
  margin-top: 30px;
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
  const UpdateProfil = (e) => {
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
        console.log(data);
        alert("Modification réussi");
        setPseudo(newPseudo);
        setEmail(newEmail);
        setBio(newBio);
        setPhoto(newPhoto);
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
    <Div>
      <Form action="" onSubmit={UpdateProfil}>
        <DivInput>
          <P>
            <Span>Pseudo : </Span>
            {pseudo}
          </P>

          <input
            id="newPseudo"
            type="text"
            placeholder="Modifier votre pseudo"
            onChange={(e) => (newPseudo = e.target.value)}
          />
        </DivInput>
        <DivInput>
          <P>
            <Span>Email : </Span>
            {email}
          </P>
          <input
            type="email"
            placeholder="Modifier votre email"
            onChange={(e) => (newEmail = e.target.value)}
          />
        </DivInput>
        <DivInput>
          <P>
            <Span>Password : </Span>
          </P>
          <input
            type="password"
            placeholder="Modifier votre password"
            onChange={(e) => (newPassword = e.target.value)}
          />
        </DivInput>
        <DivInput>
          <P>
            <Span>Bio : </Span>
            {bio}
          </P>

          <textarea
            type="text"
            placeholder="Modifier votre bio"
            onChange={(e) => (newBio = e.target.value)}
          />
        </DivInput>
        <DivInput>
          <P>
            <Span>Photo de profil: </Span>
            {pseudo}
          </P>
          <ImgProfil src={photo} alt="photo de profil" />
          <br />

          <input
            id=" photoProfil"
            name="photoProfil"
            type="file"
            accept="image/*"
            onChange={(e) => (newPhoto = e.target.files)}
          />
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
