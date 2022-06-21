import axios from "axios";
import React, { useEffect } from "react";
import logColor from "../../style/color-style";

function UsersPage() {
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/api/user/`,
      withCredentials: true,
    }).then((data) => {
      data.data.forEach((element) => {
        const usersContent = document.getElementById("usersContent");
        usersContent.style = `
        display:flex;
        justify-content: center;
        justify-items: center;
        flex-flow: row wrap;
        position: relative;
        `;
        const userContent = document.createElement("div");
        userContent.style = `
          border: 2px solid ${logColor.tertiary};
          font-weight:bold; 
          display:flex; 
          flex-direction: column;
          justify-content: space-around; 
          text-align: center;
          align-items:center; 
          height:200px; 
          width:200px;
          border-radius: 10px;
          overflow:hidden;
          cursor: pointer;
          margin: 20px;

          
          `;
        userContent.onmouseleave = () => {
          userContent.style = `
          border: 2px solid ${logColor.tertiary}; 
          font-weight:bold; 
          display:flex; 
          flex-direction: column;
          justify-content: space-around; 
          text-align: center;
          align-items:center; 
          height:200px; 
          width:200px;
          border-radius: 10px;
          overflow:hidden;
          cursor: pointer;
          margin: 20px;

          
          `;
        };
        userContent.onmouseenter = () => {
          userContent.style = `
          border: 2px solid ${logColor.tertiary}; 
          font-weight:bold; 
          display:flex; 
          flex-direction: column;
          justify-content: space-around; 
          text-align: center;
          align-items:center; 
          height:200px; 
          width:200px;
          border-radius: 10px;
          overflow:hidden;
          cursor: pointer;
          margin: 20px;
          box-shadow: 2px 5px 5px ${logColor.tertiary};
          transform: scale(1.1);`;
        };
        userContent.onclick = () => {
          GetUser();
        };

        const userPseudo = document.createElement("p");
        userPseudo.style = `width:20%;  margin:0;  border-bottom:0px;`;
        const userEmail = document.createElement("p");
        userEmail.style = `width:20%;  margin:0;border-bottom:0px;`;
        const userBio = document.createElement("p");
        userBio.style = `width:40%;  margin:0; border-bottom:0px;`;
        const userPhoto = document.createElement("img");
        userPhoto.style = `
        
          width: 150px;
          height: 150px;
          border-radius: 100px;
          overflow: hidden;
          `;
        userPhoto.src = `${element.photo}`;
        userPhoto.alt = "Photo de profil";

        const divUser = document.createElement("div");

        usersContent.appendChild(divUser);
        usersContent.appendChild(userContent);
        userContent.appendChild(userPhoto);
        userContent.appendChild(userPseudo);

        userPseudo.innerHTML = `${element.pseudo}`;

        let divActiv = false;

        const GetUser = () => {
          if (divActiv === false) {
            divActiv = true;
            console.log(divActiv);
            divUser.style = `
            border: 3px solid black;
            border-radius: 20px;
            width: 25%;
            min-width: 200px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            box-shadow: 5px 5px 5px  ${logColor.tertiary};
            `;
            divUser.onclick = () => {
              divUserClick();
            };
            const divUserClick = () => {
              divUser.style = `
              display:none;`;
              divUser.innerHTML = "";
              divActiv = false;
              console.log(divActiv);
            };
            const userPhotoActiv = document.createElement("img");
            userPhotoActiv.src = `${element.photo}`;
            userPhotoActiv.alt = "Photo de profil";
            userPhotoActiv.style = `
            margin-top: 10px;
              width: 90%;
              height: 50%;
              border-radius: 100px;
              overflow: hidden;
              `;
            const userPseudoActiv = document.createElement("div");
            userPseudoActiv.style = `
            width:100%;
            display: flex;
            align-items:center;
            `;
            const userEmailActiv = document.createElement("div");
            userEmailActiv.style = `
            width:100%;
            display: flex;
            align-items:center;`;
            const userBioActiv = document.createElement("div");
            userBioActiv.style = `
            width:100%;
            display: flex;
            align-items:center;
            margin-bottom:20px;`;

            divUser.appendChild(userPhotoActiv);
            divUser.appendChild(userPseudoActiv);
            divUser.appendChild(userEmailActiv);
            divUser.appendChild(userBioActiv);
            userPseudoActiv.innerHTML = `<p style="font-weight: bold"> Pseudo :  </p> ${element.pseudo}`;
            userEmailActiv.innerHTML = `<p style="font-weight: bold"> Email :  </p>  ${element.email} `;
            userBioActiv.innerHTML = `<p style="font-weight: bold">Bio :  </p> ${element.bio}  `;
          }
        };
      });
    });
  }, []);

  return <div id="usersContent"></div>;
}

export default UsersPage;
