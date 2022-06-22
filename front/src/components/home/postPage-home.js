import axios from "axios";
import FormData from "form-data";
import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import logColor from "../../style/color-style";
import { idContext } from "../appContext";

//composant stylisé

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DivPost = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PostsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

let comment = null;
let postText = null;
let postPhoto = null;
let updateText = null;
let updateImage = null;
let updateTextComment = null;
let PosterId = "";

//fonction de tri par ordre décroissant
const sortPost = (a, b) => {
  if (a.postId < b.postId) {
    return +1;
  }
  if (a.postId > b.postId) {
    return -1;
  } else {
    return 0;
  }
};
const sortComment = (a, b) => {
  if (a.id < b.id) {
    return +1;
  }
  if (a.id > b.id) {
    return -1;
  } else {
    return 0;
  }
};

function PostPage() {
  PosterId = useContext(idContext);

  useEffect(() => {
    /////////////////////////// Posts ///////////////////////////

    /////////////////////////// Créer un post ///////////////////////////

    //recherche d'élément dans le DOM
    const postsContent = document.getElementById("postsContent");
    const divPost = document.getElementById("divPost");

    //création d'élément dans le DOM
    const postForm = document.createElement("form");
    postForm.style = `
      margin-top: 20px;
      margin-bottom: 40px;
      padding-top: 10px;
      width: 70%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid ${logColor.primary};
      border-radius: 20px;
    `;
    postForm.onsubmit = (e) => {
      Post(e);
    };

    const postLabel = document.createElement("label");
    postLabel.htmlFor = "postTextarea";
    postLabel.innerHTML = "<strong>Postez ici !</strong>";

    const postTextarea = document.createElement("textarea");
    postTextarea.id = "postTextarea";
    postTextarea.name = "postTextarea";
    postTextarea.style = `
      height: 100px;
      width: 80%;
      margin: 10px;`;
    postTextarea.onchange = (e) => {
      postText = e.target.value;
    };
    postTextarea.placeholder = "Ecrivez votre post ici !";

    const postError = document.createElement("div");

    const postFilesLabel = document.createElement("label");
    postFilesLabel.htmlFor = "postFiles";
    postFilesLabel.innerHTML = "Selectionner un fichier à télécharger";
    postFilesLabel.style = `
    text-decoration: underline;
    margin-bottom: 10px;
    display: flex;
    text-align: center;
    `;
    postFilesLabel.onmouseenter = () => {
      postFilesLabel.style = `
      color: ${logColor.primary};
      cursor: pointer;
      text-decoration: underline;
      margin-bottom: 10px;
      display: flex;
      text-align: center;
      `;
    };
    postFilesLabel.onmouseleave = () => {
      postFilesLabel.style = `
      color:${logColor.tertiary};
      text-decoration: underline;
      margin-bottom: 10px;
      display: flex;
      text-align: center;
      `;
    };

    const postFiles = document.createElement("input");
    postFiles.type = "file";
    postFiles.id = "postFiles";
    postFiles.name = "postFiles";
    postFiles.style = `
    display: none`;
    postFiles.onchange = (e) =>
      (postPhoto = e.target.files) &
      (postFilesValue.innerHTML = e.target.value.split("fakepath\\")[1]);

    const postFilesValue = document.createElement("div");
    postFilesValue.style = `
    display: flex;
    text-align: center;
    `;

    const postFilesError = document.createElement("div");
    postFilesError.style = `
    display: flex;
    text-align: center;
    `;

    const buttonPost = document.createElement("input");
    buttonPost.type = "submit";
    buttonPost.style = `
      margin-top:30px;
      margin-bottom: 15px`;
    buttonPost.value = `Poster !`;

    //insertion d'élément dans le DOM
    divPost.appendChild(postForm);
    postForm.appendChild(postLabel);
    postForm.appendChild(postTextarea);
    postForm.appendChild(postError);
    postForm.appendChild(postFilesLabel);
    postForm.appendChild(postFiles);
    postForm.appendChild(postFilesValue);
    postForm.appendChild(postFilesError);
    postForm.appendChild(buttonPost);

    //Envoyer le post
    const Post = (e) => {
      e.preventDefault();

      try {
        if (postText == null && postPhoto == null) {
          return (postError.innerHTML = `<p style="color :${logColor.primary}">Veuillez ajouter du texte ou une image</p>`);
        }
        let bodyFormData = new FormData();
        bodyFormData.append("posterId", PosterId);
        if (postText == null) {
          console.log("ok");
        }
        if (postText != null) {
          bodyFormData.append("texte", postText);
        }
        if (postPhoto != null) {
          bodyFormData.append("image", postPhoto[0]);
        }
        axios({
          method: "post",
          url: `http://localhost:5000/api/post/`,
          withCredentials: true,
          data: bodyFormData,
          headers: {
            "Content-Type": `multipart/form-data, boundary${bodyFormData._boundary}`,
          },
        })
          .then((data) => {
            alert("Post créé");
            if (postText != null) {
              postText = null;
              postTextarea.value = "";
            }
            if (postPhoto != null) {
              postPhoto = null;
              postFilesValue.innerHTML = null;
            }
            postsContent.innerHTML = "";

            GetPost();
          })
          .catch((error) => {
            return console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    /////////////////////////// Afficher les posts ///////////////////////////
    const GetPost = () => {
      axios({
        method: "get",
        url: `http://localhost:5000/api/post/`,
        withCredentials: true,
      })
        .then((data) => {
          //tri des posts
          let dataSort = data.data.sort(sortPost);
          dataSort.forEach((element) => {
            axios({
              method: "get",
              url: `http://localhost:5000/api/post/like/${element.postId}`,
              withCredentials: true,
            })
              .then((dataLike) => {
                //requête pour obtenir le pseudo de l'utilisateur qui à fait le post
                axios({
                  method: "get",
                  url: `http://localhost:5000/api/user/${element.posterId}`,
                  withCredentials: true,
                })
                  .then((dataUser) => {
                    axios({
                      method: "get",
                      url: `http://localhost:5000/api/post/likers/${element.postId}`,
                      withCredentials: true,
                    })
                      .then((dataLikers) => {
                        // création d'élément dans le DOM
                        const postContent = document.createElement("div");
                        postContent.style =
                          `border: 1px solid ${logColor.primary};` +
                          "border-radius: 20px;" +
                          "font-weight:bold;" +
                          "display:flex;" +
                          "flex-direction: column;" +
                          "align-items:center;" +
                          "text-align: center;" +
                          "min-height:100px;" +
                          "width: 70%;" +
                          "margin-top: 20px;";

                        const posterContent = document.createElement("div");
                        posterContent.style = `
                          width:100%;
                          display: flex;
                          justify-content: space-around;
                          border-bottom: 1px solid ${logColor.secondary};
                          align-items: center;`;

                        const divPostUpdate = document.createElement("div");

                        const buttonUpdate = document.createElement("input");
                        buttonUpdate.type = "submit";
                        buttonUpdate.value = "modifier";
                        buttonUpdate.onclick = () => {
                          UpdatePost();
                        };
                        buttonUpdate.style = `
                        margin:10px
                        `;

                        const buttonDelete = document.createElement("input");
                        buttonDelete.type = "submit";
                        buttonDelete.value = "supprimer";
                        buttonDelete.onclick = () => {
                          deletePost();
                        };
                        buttonDelete.style = `
                        margin:10px;
                        `;

                        const likesContent = document.createElement("div");
                        likesContent.style = `
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                        `;

                        const like = document.createElement("div");

                        //Gestion bouton like
                        if (dataLikers.data) {
                          const userLiker = dataLikers.data.map(
                            (e) => e.likerId
                          );
                          const userLikerBoolean = userLiker.includes(PosterId);

                          if (userLikerBoolean) {
                            like.style = `
                          font-size: 22px;
                          -webkit-text-stroke-width: 1.2px
                          transition: color 2s ease-in-out;
                          background: -webkit-gradient(linear, left bottom, left top, from(${logColor.primary}), to(${logColor.secondary}));
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                          -webkit-text-stroke-color: ${logColor.tertiary};
                          cursor: pointer;
                          `;
                          } else {
                            like.style = `cursor: pointer;
                          color: transparent;
                          font-size: 20px;
                          -webkit-text-stroke-width: 1.2px;
                          -webkit-text-stroke-color: ${logColor.tertiary};
                          font-weight: bold;
                          `;
                          }
                        } else {
                          like.style = `cursor: pointer;
                          color: transparent;
                          font-size: 20px;
                          -webkit-text-stroke-width: 1.2px;
                          -webkit-text-stroke-color: ${logColor.tertiary};
                          font-weight: bold;
                          `;
                        }
                        like.onclick = () => {
                          handleLikes();
                        };

                        const numbersOfLikes = document.createElement("div");
                        numbersOfLikes.style = `
                        margin-left:5px;
                        `;

                        const posterName = document.createElement("p");
                        posterName.style = "margin:10px;";

                        const updateContent = document.createElement("div");
                        updateContent.style = `
                        width:100%;
                        display:flex;
                        justify-content: center;
                        `;

                        const postTexte = document.createElement("p");

                        const postImgContent = document.createElement("div");
                        postImgContent.style = `
                        width:80%;
                        height: 100%;
                        margin: 20px;
                        `;

                        postTexte.style = `width:100%; margin:20px;`;

                        const postPhoto = document.createElement("img");
                        postPhoto.style = `
                          width:100%;
                          height:100%;
                         max-height:100%;
                         max-width:100%;
                          `;

                        const buttonComments = document.createElement("input");
                        buttonComments.value = "Commentaires";
                        buttonComments.type = "button";
                        buttonComments.style = `width:100px;margin-bottom:20px;`;
                        buttonComments.onclick = () => {
                          HandleComments();
                        };

                        const commentsContent = document.createElement("div");
                        commentsContent.style = `width: 100%;`;

                        //insertion d'éléments dans le DOM
                        postsContent.appendChild(postContent);
                        postContent.appendChild(posterContent);
                        if (PosterId === element.posterId || PosterId === 95) {
                          postContent.appendChild(divPostUpdate);
                          divPostUpdate.appendChild(buttonUpdate);
                          divPostUpdate.appendChild(buttonDelete);
                          postContent.appendChild(updateContent);
                        }
                        posterContent.appendChild(posterName);
                        posterContent.appendChild(likesContent);
                        likesContent.appendChild(like);
                        likesContent.appendChild(numbersOfLikes);
                        if (element.photo) {
                          postContent.appendChild(postImgContent);
                          postImgContent.appendChild(postPhoto);
                        }
                        if (element.texte) {
                          postContent.appendChild(postTexte);
                        }
                        postContent.appendChild(buttonComments);
                        postContent.appendChild(commentsContent);

                        if (dataUser.data.pseudo) {
                          posterName.innerHTML = `Posté par : ${dataUser.data.pseudo}`;
                        } else {
                          posterName.innerHTML = `Posté par : un ancien utilisateur`;
                        }
                        like.innerHTML = `<i class="fas fa-heart"></i>`;

                        numbersOfLikes.innerHTML = `${dataLike.data[0]}`;

                        if (element.photo) {
                          postPhoto.src = element.photo;
                          postPhoto.alt = "Photo du post";
                        }
                        if (element.texte) {
                          postTexte.innerHTML = ` ${element.texte} `;
                        }

                        /////////////////////////// Liker un post ///////////////////////////

                        const handleLikes = () => {
                          axios({
                            method: "post",
                            url: `http://localhost:5000/api/post/like/${element.postId}`,
                            withCredentials: true,
                            data: { likerId: PosterId },
                          })
                            .then((dataPostLike) => {
                              axios({
                                method: "get",
                                url: `http://localhost:5000/api/post/like/${element.postId}`,
                                withCredentials: true,
                              })
                                .then((dataLike) => {
                                  if (dataPostLike.data.message === "Liké !") {
                                    like.style = `
                                    font-size: 22px;
                                    -webkit-text-stroke-width: 1.2px
                                    transition: color 2s ease-in-out;
                                    background: -webkit-gradient(linear, left bottom, left top, from(${logColor.primary}), to(${logColor.secondary}));
                                    -webkit-background-clip: text;
                                    -webkit-text-fill-color: transparent;
                                    -webkit-text-stroke-color: ${logColor.tertiary};
                                    cursor: pointer;
                                    `;

                                    numbersOfLikes.innerHTML = `${dataLike.data[0]}`;
                                  }
                                  if (
                                    dataPostLike.data.message === "Unliké !"
                                  ) {
                                    like.style = `cursor: pointer;
                                    color: transparent;
                                    font-size: 20px;
                                    -webkit-text-stroke-width: 1.2px;
                                    -webkit-text-stroke-color: ${logColor.tertiary};
                                    font-weight: bold;`;
                                    numbersOfLikes.innerHTML = `${dataLike.data[0]}`;
                                  }
                                  console.log(dataPostLike.data.message);
                                })
                                .catch((error) => {
                                  return console.log(error);
                                });
                            })
                            .catch((error) => {
                              return console.log(error);
                            });
                        };

                        /////////////////////////// Modifier un post ///////////////////////////

                        let postUpdateActiv = false;

                        const UpdatePost = () => {
                          if (postUpdateActiv === false) {
                            //création d'éléments dans le DOM
                            const updateForm = document.createElement("form");
                            updateForm.onsubmit = (e) => {
                              Update(e);
                            };
                            updateForm.style = `
                            display:flex;
                            flex-direction: column;
                            align-items: center;
                            width:100%;
                            margin:0;
                            `;

                            const updateLabel = document.createElement("label");
                            updateLabel.htmlFor = "updateTextarea";
                            updateLabel.innerHTML = "Modifiez ici !";

                            const updateInput =
                              document.createElement("textarea");
                            updateInput.id = "updateTextarea";
                            updateInput.name = "updateTextarea";
                            updateInput.onchange = (e) => {
                              updateText = e.target.value;
                            };
                            updateInput.style = `
                            width:80%;
                            min-height: 75px;
                            margin-top:10px;
                            margin-bottom:10px;
                            `;
                            updateInput.placeholder = "Modifiez votre post !";

                            const updateFilesLabel =
                              document.createElement("label");
                            updateFilesLabel.htmlFor = "updateFiles";
                            updateFilesLabel.innerHTML =
                              "Selectionnez un fichier à télécharger";
                            updateFilesLabel.style = `
                              text-decoration: underline;
                              margin-bottom: 10px;
                              display: flex;
                              text-align: center;
                              `;
                            updateFilesLabel.onmouseenter = () => {
                              updateFilesLabel.style = `
                              color: ${logColor.primary};
                              cursor: pointer;
                              text-decoration: underline;
                              margin-bottom: 10px;
                              display: flex;
                              text-align: center;
                              `;
                            };
                            updateFilesLabel.onmouseleave = () => {
                              updateFilesLabel.style = `
                              color:${logColor.tertiary};
                              text-decoration: underline;
                              margin-bottom: 10px;
                              display: flex;
                              text-align: center;
                              `;
                            };

                            const updateFiles = document.createElement("input");
                            updateFiles.type = "file";
                            updateFiles.id = "updateFiles";
                            updateFiles.name = "updateFiles";
                            updateFiles.style = `
                            display: none`;
                            updateFiles.onchange = (e) =>
                              (updateImage = e.target.files) &
                              (updateFilesValue.innerHTML =
                                e.target.value.split("fakepath\\")[1]);

                            const updateFilesValue =
                              document.createElement("div");
                            updateFilesValue.style = `
                            display: flex;
                            text-align: center;
                            `;

                            const updateError = document.createElement("div");
                            updateError.id = "updateError";
                            updateError.style = `
                              display: flex;
                              text-align: center;
                              `;

                            const updateButton =
                              document.createElement("input");
                            updateButton.type = "submit";

                            //insertion d'éléments dans le DOM
                            updateContent.appendChild(updateForm);
                            updateForm.appendChild(updateLabel);
                            updateForm.appendChild(updateInput);
                            updateForm.appendChild(updateFilesLabel);
                            updateForm.appendChild(updateFilesValue);
                            updateForm.appendChild(updateFiles);
                            updateForm.appendChild(updateError);
                            updateForm.appendChild(updateButton);
                            postUpdateActiv = true;
                          } else {
                            updateContent.innerHTML = "";
                            postUpdateActiv = false;
                          }

                          //envoi des modifications
                          const Update = (e) => {
                            e.preventDefault();
                            try {
                              const updateError =
                                document.getElementById("updateError");

                              if (updateText == null && updateImage == null) {
                                return (updateError.innerHTML = `<p style="color :${logColor.primary}">Veuillez modifié le texte ou l' image</p>`);
                              }

                              let bodyFormData = new FormData();
                              bodyFormData.append("posterId", PosterId);

                              if (updateText != null) {
                                bodyFormData.append("texte", updateText);
                              }
                              if (updateImage != null) {
                                bodyFormData.append("image", updateImage[0]);
                              }
                              axios({
                                method: "put",
                                url: `http://localhost:5000/api/post/${element.postId}`,
                                withCredentials: true,
                                data: bodyFormData,
                                headers: {
                                  "Content-Type": `multipart/form-data, boundary${bodyFormData._boundary}`,
                                },
                              })
                                .then((data) => {
                                  if (updateText != null) {
                                    updateText = null;
                                  }
                                  if (updateImage != null) {
                                    updateImage = null;
                                  }
                                  postsContent.innerHTML = "";
                                  GetPost();
                                })
                                .catch((error) => {
                                  return console.log(error);
                                });
                            } catch (error) {
                              console.log(error);
                            }
                          };
                        };

                        /////////////////////////// Supprimer un post ///////////////////////////
                        const deletePost = () => {
                          try {
                            axios({
                              method: "delete",
                              url: `http://localhost:5000/api/post/${element.postId}`,
                              withCredentials: true,
                            })
                              .then((data) => {
                                alert("Post supprimé");
                                postsContent.innerHTML = "";
                                GetPost();
                              })
                              .catch((error) => {
                                return console.log(error);
                              });
                          } catch (error) {
                            console.log(error);
                          }
                        };
                        ////////////////////////////////////////////////////////////////

                        /////////////////////////// Commentaires ///////////////////////////
                        let commentActiv = false;
                        const HandleComments = () => {
                          if (commentActiv === false) {
                            commentActiv = true;

                            //création d'élément dans le DOM
                            const errorComments = document.createElement("div");
                            errorComments.style = `
                              color: ${logColor.primary};
                              margin:10px
                              `;

                            const formComment = document.createElement("form");
                            formComment.style = `
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              margin: 20px;
                              `;
                            formComment.onsubmit = (e) => {
                              PostComment(e);
                            };

                            const commentLabel =
                              document.createElement("label");
                            commentLabel.htmlFor = "commentTextarea";
                            commentLabel.innerHTML =
                              "Modifiez votre commentaire";

                            const addComment =
                              document.createElement("textarea");
                            addComment.id = "commentTextarea";
                            addComment.name = "commentTextarea";
                            addComment.style = `
                              width:80%;
                              height: 80px;
                              margin-top:10px;
                              `;
                            addComment.placeholder =
                              "Ecrivez votre commentaire ici !";
                            addComment.onchange = (e) => {
                              comment = e.target.value;
                            };

                            const buttonAddComment =
                              document.createElement("input");
                            buttonAddComment.type = "submit";
                            buttonAddComment.value = " Commenter";
                            buttonAddComment.style = `
                            margin-top:15px;
                            `;

                            const errorComment = document.createElement("div");

                            const divComments = document.createElement("div");
                            divComments.style = `   
                              margin-bottom: 20px;
                              `;

                            //insertion d'éléments dans le DOM
                            commentsContent.appendChild(errorComments);
                            commentsContent.appendChild(formComment);
                            formComment.appendChild(commentLabel);
                            formComment.appendChild(addComment);
                            formComment.appendChild(buttonAddComment);
                            formComment.appendChild(errorComment);
                            commentsContent.appendChild(divComments);

                            //////////////// Affichage commentaires /////////////////
                            //requête avec l'id du post

                            const GetComments = () => {
                              axios({
                                method: "get",
                                url: `http://localhost:5000/api/post/comment/${element.postId}`,
                                withCredentials: true,
                              })
                                .then((data) => {
                                  //tri les commentaires du plus récent au plus ancien
                                  let commentSort = data.data.sort(sortComment);
                                  console.log(commentSort);
                                  commentSort.forEach((el) => {
                                    //requête avec l'id de l'utilisateur qui a poster le commentaire
                                    axios({
                                      method: "get",
                                      url: `http://localhost:5000/api/user/${el.posterId}`,
                                      withCredentials: true,
                                    })
                                      .then((dataUser) => {
                                        //création d'éléments dans le DOM
                                        const divComment =
                                          document.createElement("div");
                                        divComment.style = `
                                          margin-bottom: 20px;
                                          `;

                                        const allComments =
                                          document.createElement("div");

                                        const divUpdate =
                                          document.createElement("div");

                                        const buttonUpdateComment =
                                          document.createElement("input");
                                        buttonUpdateComment.type = "submit";
                                        buttonUpdateComment.value = "modifier";
                                        buttonUpdateComment.onclick = () => {
                                          updateComment();
                                        };
                                        buttonUpdateComment.style = `
                                        height: 100%;
                                        margin-bottom:10px;
                                        margin-right:10px;
                                        `;

                                        const buttonDeleteComment =
                                          document.createElement("input");
                                        buttonDeleteComment.type = "submit";
                                        buttonDeleteComment.value = "supprimer";
                                        buttonDeleteComment.onclick = () => {
                                          deleteComment();
                                        };
                                        buttonDeleteComment.style = `
                                          height: 100%;
                                          margin-bottom:10px;
                                          margin-left: 10px;
                                          `;

                                        allComments.style = `
                                        border:1px solid black;
                                        border-radius: 20px;
                                        background-color: ${logColor.secondary};
                                        margin: 10px;
                                        `;

                                        //insertion d'éléments dans le DOM
                                        commentsContent.appendChild(
                                          errorComments
                                        );
                                        divComments.appendChild(divComment);
                                        divComment.appendChild(allComments);
                                        divComment.appendChild(divUpdate);
                                        if (
                                          PosterId === el.posterId ||
                                          PosterId === 95
                                        ) {
                                          divUpdate.appendChild(
                                            buttonUpdateComment
                                          );
                                          divUpdate.appendChild(
                                            buttonDeleteComment
                                          );
                                        }

                                        allComments.innerHTML = `
                                        <p>Commentaire écrit par :   <span style="color: ${logColor.primary}">${dataUser.data.pseudo}</span></p>
                                        <p>${el.text}</p>`;

                                        const updateFormComment =
                                          document.createElement("form");

                                        const updateErrorComment =
                                          document.createElement("div");

                                        ///////////////////////////////Modifier un commentaire///////////////////////////

                                        let commentUpdateActiv = false;
                                        const updateComment = () => {
                                          if (commentUpdateActiv === false) {
                                            commentUpdateActiv = true;

                                            //création d'éléments dans le DOM
                                            updateFormComment.onsubmit = (
                                              e
                                            ) => {
                                              update(e);
                                            };
                                            updateFormComment.style = `
                                            display:flex;
                                            flex-direction: column;
                                            align-items:center;
                                            `;

                                            const updateCommentLabel =
                                              document.createElement("label");
                                            updateCommentLabel.htmlFor =
                                              "updateInputComment";
                                            updateCommentLabel.innerHTML =
                                              "Modifiez votre commentaire";

                                            const updateInputComment =
                                              document.createElement(
                                                "textarea"
                                              );
                                            updateInputComment.id =
                                              "updateInputComment";
                                            updateInputComment.name =
                                              "updateInputComment";
                                            updateInputComment.onchange = (
                                              e
                                            ) => {
                                              updateTextComment =
                                                e.target.value;
                                            };
                                            updateInputComment.style = `
                                            width:70%;
                                            height: 75px;
                                            margin-bottom: 15px;
                                            `;
                                            updateInputComment.placeholder =
                                              " Ecrivez votre commentaire ici !";

                                            const updateButton =
                                              document.createElement("input");
                                            updateButton.type = "submit";

                                            //insertion d'éléments dans le DOM
                                            divComment.appendChild(
                                              updateFormComment
                                            );
                                            divComment.appendChild(
                                              updateErrorComment
                                            );
                                            updateFormComment.appendChild(
                                              updateCommentLabel
                                            );
                                            updateFormComment.appendChild(
                                              updateInputComment
                                            );

                                            updateFormComment.appendChild(
                                              updateButton
                                            );
                                            //envoi des modifications du commentaire
                                            const update = (e) => {
                                              e.preventDefault();
                                              try {
                                                if (
                                                  updateTextComment === null
                                                ) {
                                                  return (updateErrorComment.innerHTML = `<p style="color :${logColor.primary}">Veuillez modifié le commentaire</p>`);
                                                }

                                                axios({
                                                  method: "put",
                                                  url: `http://localhost:5000/api/post/comment/${el.id}`,
                                                  withCredentials: true,
                                                  data: {
                                                    posterId: PosterId,
                                                    postId: element.postId,
                                                    text: updateTextComment,
                                                  },
                                                })
                                                  .then((data) => {
                                                    divComments.innerHTML = "";
                                                    updateTextComment = null;
                                                    GetComments();
                                                  })
                                                  .catch((error) => {
                                                    return console.log(error);
                                                  });
                                              } catch (error) {
                                                console.log(error);
                                              }
                                            };
                                          } else {
                                            commentUpdateActiv = false;
                                            updateFormComment.innerHTML = "";
                                            updateErrorComment.innerHTML = "";
                                          }
                                        };

                                        //////////////////////////////Supprimer un commentaire///////////
                                        const deleteComment = () => {
                                          try {
                                            axios({
                                              method: "delete",
                                              url: `http://localhost:5000/api/post/comment/${el.id}`,
                                              withCredentials: true,
                                            })
                                              .then((data) => {
                                                if (updateErrorComment) {
                                                  updateErrorComment.innerHTML =
                                                    "";
                                                }
                                                divComments.innerHTML = "";
                                                GetComments();
                                              })
                                              .catch((error) => {
                                                return console.log(error);
                                              });
                                          } catch (error) {
                                            console.log(error);
                                          }
                                        };
                                        /////////////////////////////////////////////////////////////////
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                  });
                                })

                                .catch((error) => {
                                  errorComments.innerHTML =
                                    "Aucun commentaire sur ce post";
                                  console.log(error);
                                });
                            };
                            GetComments();

                            ////////////////////  Poster un commentaire /////////////////////

                            const PostComment = (e) => {
                              e.preventDefault();

                              if (comment === null) {
                                return (errorComment.innerHTML = `<p style="color :${logColor.primary}">Veuillez écrire un commentaire</p>`);
                              }
                              try {
                                axios({
                                  method: "post",
                                  url: `http://localhost:5000/api/post/comment/`,
                                  withCredentials: true,
                                  data: {
                                    posterId: PosterId,
                                    postId: element.postId,
                                    text: comment,
                                  },
                                })
                                  .then((data) => {
                                    console.log(data);
                                    if (errorComments) {
                                      errorComments.innerHTML = null;
                                    }
                                    if (errorComment) {
                                      errorComment.innerHTML = null;
                                    }
                                    addComment.value = "";
                                    divComments.innerHTML = "";
                                    comment = null;
                                    GetComments();
                                  })
                                  .catch((error) => {
                                    return console.log(error);
                                  });
                              } catch (error) {
                                console.log(error);
                              }
                            };
                          } else {
                            commentsContent.innerHTML = "";
                            commentActiv = false;
                          }
                        };

                        /////////////////////////////////////////////////////////////////
                      })
                      .catch((error) => {
                        return console.log(error);
                      });
                  })
                  .catch((error) => {
                    if (
                      error.response.data.message === "Utilisateur introuvable"
                    ) {
                      console.log("Utilisateur supprimé");
                    } else {
                      console.log(error);
                    }
                  });
              })
              .catch((error) => {
                return console.log(error);
              });
          });
        })
        .catch((error) => {
          return console.log(error);
        });
    };
    GetPost();
  }, []);

  return (
    <PageContent id="pageContent">
      <DivPost id="divPost"></DivPost>
      <PostsContent id="postsContent"></PostsContent>
    </PageContent>
  );
}

export default PostPage;
