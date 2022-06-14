import axios from "axios";
import React, { useEffect } from "react";
import styled from "styled-components";

function UsersPage() {
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/api/user/`,
      withCredentials: true,
    }).then((data) => {
      data.data.forEach((element) => {
        const userContent = document.createElement("div");
        userContent.style =
          "border: 2px solid black;" +
          "font-weight:bold;" +
          "display:flex;" +
          "justify-content: space-around;" +
          "align-items:center;" +
          "height:100px;" +
          "cursor: pointer;";

        const userPseudo = document.createElement("p");
        userPseudo.style = "width:20%;" + "margin:0;" + "border-bottom:0px;";
        const userEmail = document.createElement("p");
        userEmail.style = "width:20%;" + "margin:0;" + "border-bottom:0px;";
        const userBio = document.createElement("p");
        userBio.style = "width:40%;" + "margin:0;" + "border-bottom:0px;";
        const userPhoto = document.createElement("p");
        userPhoto.style =
          "width:20%;" +
          "margin:0;" +
          "border-bottom:0px;" +
          "display:flex;" +
          "justify-content:center;";

        const usersContent = document.getElementById("usersContent");

        usersContent.appendChild(userContent);
        userContent.appendChild(userPhoto);
        userContent.appendChild(userPseudo);
        userContent.appendChild(userEmail);
        userContent.appendChild(userBio);
        userPhoto.innerHTML = `<img  src="${element.photo}" alt="photo de profil"  style="height:100px;" /> `;
        userPseudo.innerHTML = `${element.pseudo}`;
        userEmail.innerHTML = ` ${element.email} `;
        userBio.innerHTML = `${element.bio}  `;
      });
    });
  });

  return <div id="usersContent"></div>;
}

export default UsersPage;
