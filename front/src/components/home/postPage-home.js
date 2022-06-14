import axios from "axios";
import React, { useEffect } from "react";
import styled from "styled-components";
import logColor from "../../style/color-style";
import { idContext } from "../appContext";

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
var comment = "";

function PostPage() {
  useEffect(() => {
    //////////////////// Posts ///////////////////////////
    //requête posts
    axios({
      method: "get",
      url: `http://localhost:5000/api/post/`,
      withCredentials: true,
    })
      .then((data) => {
        data.data.forEach((element) => {
          //requête user pour obtenir le pseudo de l'utilisateur qui à fait le post
          axios({
            method: "get",
            url: `http://localhost:5000/api/user/${element.posterId}`,
            withCredentials: true,
          })
            .then((dataUser) => {
              const postsContent = document.getElementById("postsContent");
              const postContent = document.createElement("div");

              postContent.style =
                `border: 1px solid ${logColor.primary};` +
                "border-radius: 20px;" +
                "font-weight:bold;" +
                "display:flex;" +
                "flex-direction: column;" +
                "align-items:center;" +
                "text-align: center;" +
                "min-height:300px;" +
                "width: 70%;" +
                "margin-top: 20px;";

              const posterContent = document.createElement("div");
              posterContent.style = "width:100%;" + "text-align: start;";

              const posterId = document.createElement("p");
              posterId.style = "margin:10px;";

              const postTexte = document.createElement("p");
              postTexte.style = "width:100%;" + "margin:20px;";
              const postPhoto = document.createElement("p");
              postPhoto.style =
                "height:300px;" +
                "margin-top:10px;" +
                "display:flex;" +
                "justify-content:center;";

              const buttonComments = document.createElement("input");
              buttonComments.value = "Commentaires";
              buttonComments.type = "button";
              buttonComments.style = " width:100px;" + "margin-bottom:20px;";
              buttonComments.onclick = () => {
                HandleComments();
              };
              const commentsContent = document.createElement("div");
              commentsContent.style = `width: 100%;`;

              postsContent.appendChild(postContent);
              postContent.appendChild(posterContent);
              posterContent.appendChild(posterId);
              postContent.appendChild(postPhoto);
              postContent.appendChild(postTexte);
              postContent.appendChild(buttonComments);
              postContent.appendChild(commentsContent);

              posterId.innerHTML = `Posté par : ${dataUser.data.pseudo}`;
              postPhoto.innerHTML = `<img  src="${element.photo}" alt="photo de profil" /> `;

              postTexte.innerHTML = ` ${element.texte} `;

              //////////////////////////////////////////////////////////////

              ////////////////////  Commentaires  //////////////////////////

              const HandleComments = () => {
                const Error = document.createElement("div");
                Error.style = `
                color: ${logColor.primary}
                `;

                const form = document.createElement("form");
                form.style = `
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 20px;
                `;
                form.onsubmit = (e) => {
                  PostComment(e);
                };
                const addComment = document.createElement("textarea");
                addComment.style = `
                width:80%;
                height: 100px;
                `;
                addComment.placeholder = " Ajoutez un commentaire !!";
                addComment.onchange = (e) => {
                  comment = e.target.value;
                };

                const buttonAddComment = document.createElement("input");
                buttonAddComment.type = "submit";
                buttonAddComment.value = " Commenter";
                buttonAddComment.style = `
                width:50%;
                `;
                commentsContent.appendChild(Error);
                commentsContent.appendChild(form);
                form.appendChild(addComment);
                form.appendChild(buttonAddComment);

                //////////////// Affichage commentaires /////////////////

                //requête comment avec l'id du post
                axios({
                  method: "get",
                  url: `http://localhost:5000/api/post/comment/${element.postId}`,
                  withCredentials: true,
                })
                  .then((data) => {
                    console.log(data);
                    data.data.forEach((el) => {
                      //requête user avec l'id de l'utilisateur qui a poster le commentaire
                      axios({
                        method: "get",
                        url: `http://localhost:5000/api/user/${el.posterId}`,
                        withCredentials: true,
                      })
                        .then((dataUser) => {
                          console.log(dataUser);
                          const allComments = document.createElement("div");
                          allComments.style = `
                        border:1px solid black;
                        border-radius: 20px;
                        background-color: ${logColor.secondary};
                        margin: 10px;
                        
                        `;
                          commentsContent.appendChild(allComments);
                          allComments.innerHTML = `
                      <p>Commentaire écrit par :   <span style="color: ${logColor.primary}">${dataUser.data.pseudo}</span></p>
                      <p>${el.text}</p>`;
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    });
                  })
                  .catch((error) => {
                    Error.innerHTML = "Aucun commentaire sur ce post";
                    console.log(error);
                  });
              };

              /////////////////////////////////////////////////////////////////

              ////////////////////  Poster un commentaire /////////////////////

              const PostComment = (e) => {
                e.preventDefault();

                console.log(element.postId);
                axios({
                  method: "post",
                  url: `http://localhost:5000/api/post/comment/`,
                  withCredentials: true,
                  data: {
                    posterId: idContext,
                    postId: element.postId,
                    text: comment,
                  },
                })
                  .then((data) => {
                    return console.log(data);
                  })
                  .catch((error) => {
                    return console.log(error);
                  });
              };

              /////////////////////////////////////////////////////////////////
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("fin");
  }, []);
  return <PageContent id="postsContent"></PageContent>;
}

export default PostPage;
