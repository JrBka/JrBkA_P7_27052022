import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { idContext } from "../appContext";

const ImgProfil = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  overflow: hidden;
`;

function UpdateProfil() {
  const id = useContext(idContext);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("");
  const [newPseudo, setNewPseudo] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newPhoto, setNewPhoto] = useState("");

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

  const updatePseudo = (e) => {
    e.preventDefault();
    axios({
      method: "put",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
      data: {
        id,
        pseudo: newPseudo,
      },
    })
      .then((data) => {
        console.log(data.data);
        console.log(newPseudo);
        alert("Modification réussi");
        window.location = "/home";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateEmail = (e) => {
    e.preventDefault();

    axios({
      method: "put",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
      data: {
        id,
        email: newEmail,
      },
    })
      .then((data) => {
        console.log(data.data);
        console.log(newPseudo);
        alert("Modification réussi");
        window.location = "/home";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateBio = (e) => {
    e.preventDefault();

    axios({
      method: "put",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
      data: {
        id,
        bio: newBio,
      },
    })
      .then((data) => {
        console.log(data.data);
        console.log(newPseudo);
        alert("Modification réussi");
        window.location = "/home";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePhoto = (e) => {
    e.preventDefault();

    axios({
      method: "put",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
      data: {
        id,
        photo: newPhoto,
      },
    })
      .then((data) => {
        console.log(data.data);
        console.log(newPseudo);
        alert("Modification réussi");
        window.location = "/home";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div>
        <p>pseudo: {pseudo}</p>
        <form action="" onSubmit={updatePseudo}>
          <input
            type="text"
            placeholder="modifier votre pseudo"
            onChange={(e) => setNewPseudo(e.target.value)}
          />
          <input type="submit" value="modifier" />
        </form>
      </div>
      <div>
        <p>email: {email}</p>
        <form action="" onSubmit={updateEmail}>
          <input
            type="email"
            placeholder="modifier votre email"
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input type="submit" value="modifier" />
        </form>
      </div>
      <div>
        <p>bio: {bio}</p>
        <form action="" onSubmit={updateBio}>
          <textarea
            type="text"
            placeholder="modifier votre bio"
            onChange={(e) => setNewBio(e.target.value)}
          />
          <input type="submit" value="modifier" />
        </form>
      </div>
      <div>
        photo de profil:
        <ImgProfil src={photo} alt="photo de profil" />
        <form action="" onSubmit={updatePhoto}>
          <input
            type="text"
            placeholder="modifier l'url de la photo"
            onChange={(e) => setNewPhoto(e.target.value)}
          />
          <input type="submit" value="modifier" />
        </form>
      </div>
    </div>
  );
}

export default UpdateProfil;
