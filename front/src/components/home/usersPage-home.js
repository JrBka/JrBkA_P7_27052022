import axios from "axios";
import React, { useEffect } from "react";
import logColor from "../../style/color-style";

// affiche tous les utilisateurs
function UsersPage() {
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/api/user/`,
      withCredentials: true,
    }).then((data) => {
      data.data.forEach((element) => {
        //recherche d'élément dans le DOM
        const usersContent = document.getElementById("usersContent");
        usersContent.style = `
        display:flex;
        justify-content: center;
        justify-items: center;
        flex-flow: row wrap;
        position: relative;
        `;

        //creation d'éléments dans le DOM
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

        //évenement "quand la souris est sur la cible"
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

        //évenement "quand la souris quitte la cible"
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

        // au click lancer GetUser()
        userContent.onclick = () => {
          GetUser();
        };

        const userPseudo = document.createElement("p");
        userPseudo.style = `width:100%;  margin:0; 
         border-bottom:0px;
         word-break: break-word;
         `;

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

        //insertion d'éléments dans le DOM
        usersContent.appendChild(divUser);
        usersContent.appendChild(userContent);
        userContent.appendChild(userPhoto);
        userContent.appendChild(userPseudo);

        userPseudo.innerHTML = `${element.pseudo}`;

        //affiche le profil complet
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
            word-break: break-word;
            `;

            const userEmailActiv = document.createElement("div");
            userEmailActiv.style = `
            width:100%;
            display: flex;
            align-items:center;
            word-break: break-word;`;

            const userBioActiv = document.createElement("div");
            userBioActiv.style = `
            width:100%;
            max-width: 200px;
            display: flex;
            align-items:center;
            margin-bottom:20px;
            word-break: break-word;
            `;

            divUser.appendChild(userPhotoActiv);
            divUser.appendChild(userPseudoActiv);
            divUser.appendChild(userEmailActiv);
            divUser.appendChild(userBioActiv);

            userPseudoActiv.innerHTML = `<p style="font-weight: bold"> Pseudo :  </p> ${element.pseudo}`;
            userEmailActiv.innerHTML = `<p style="font-weight: bold"> Email :  </p>  ${element.email} `;
            userBioActiv.innerHTML = `<p ><span style="font-weight: bold">Bio : </span >  ${element.bio}</p>   `;

            //Au click le profil complet disparait
            const divUserClick = () => {
              divUser.style = `
              display:none;`;
              divUser.innerHTML = "";
              divActiv = false;
            };
          }
        };
      });
    });
  }, []);

  return <div id="usersContent"></div>;
}

export default UsersPage;
