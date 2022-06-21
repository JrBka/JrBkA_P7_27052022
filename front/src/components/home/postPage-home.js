import axios from "axios";
import FormData from "form-data";
import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import logColor from "../../style/color-style";
import { idContext } from "../appContext";

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
    //////////////////// Posts ///////////////////////////
    //requête posts

    const postsContent = document.getElementById("postsContent");
    const divPost = document.getElementById("divPost");
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
    postLabel.innerHTML = "Postez ici !";
    const postTextarea = document.createElement("textarea");
    postTextarea.style = `
                        height: 100px;
                        width: 80%;
                        margin: 10px;
                        `;

    postTextarea.onchange = (e) => {
      postText = e.target.value;
    };

    postTextarea.placeholder = "Ecrivez votre post ici !";
    const postError = document.createElement("div");

    const postFiles = document.createElement("input");
    postFiles.type = "file";
    postFiles.id = "postFile";
    postFiles.style = `
    width: 75px;
    `;
    postFiles.onchange = (e) =>
      (postPhoto = e.target.files) &
      (postFilesValue.innerHTML = postPhoto[0].name);

    const postFilesValue = document.createElement("div");
    postFilesValue.style = `
    width:80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    `;

    const buttonPost = document.createElement("input");
    buttonPost.type = "submit";
    buttonPost.style = `
      margin-top:30px;
      margin-bottom: 15px`;

    buttonPost.value = `Poster !`;

    divPost.appendChild(postForm);
    postForm.appendChild(postLabel);
    postForm.appendChild(postTextarea);
    postForm.appendChild(postError);
    postForm.appendChild(postFiles);
    postForm.appendChild(postFilesValue);
    postForm.appendChild(buttonPost);

    //////////////////////////////Post///////////////////////////////
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
              postFilesValue.innerHTML = "";
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

    /////////////////////////////////////////////////////////////////

    const GetPost = () => {
      axios({
        method: "get",
        url: `http://localhost:5000/api/post/`,
        withCredentials: true,
      })
        .then((data) => {
          let dataSort = data.data.sort(sortPost);

          dataSort.forEach((element) => {
            axios({
              method: "get",
              url: `http://localhost:5000/api/post/like/${element.postId}`,
              withCredentials: true,
            })
              .then((dataLike) => {
                //requête user pour obtenir le pseudo de l'utilisateur qui à fait le post
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
                        `;
                        const like = document.createElement("div");
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

                        postsContent.appendChild(postContent);
                        postContent.appendChild(posterContent);
                        if (PosterId === element.posterId) {
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

                        posterName.innerHTML = `Posté par : ${dataUser.data.pseudo}`;
                        like.innerHTML = `<i class="fas fa-heart"></i>`;

                        numbersOfLikes.innerHTML = `${dataLike.data[0]}`;

                        if (element.photo) {
                          postPhoto.src = element.photo;
                        }
                        if (element.texte) {
                          postTexte.innerHTML = ` ${element.texte} `;
                        }

                        //////////////////////////////////////////////////////////////

                        ///////////////////////////////Like un post//////////////////////////////////////////////////////

                        const handleLikes = () => {
                          axios({
                            method: "post",
                            url: `http://localhost:5000/api/post/like/${element.postId}`,
                            withCredentials: true,
                            data: { likerId: PosterId },
                          })
                            .then((data) => {
                              axios({
                                method: "get",
                                url: `http://localhost:5000/api/post/like/${element.postId}`,
                                withCredentials: true,
                              })
                                .then((x) => {
                                  if (data.data.message === "Liké !") {
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

                                    numbersOfLikes.innerHTML = `${x.data[0]}`;
                                    console.log(x.data[0]);
                                  }
                                  if (data.data.message === "Unliké !") {
                                    like.style = `cursor: pointer;
                          color: transparent;
                          font-size: 20px;
                          -webkit-text-stroke-width: 1.2px;
                          -webkit-text-stroke-color: ${logColor.tertiary};
                          font-weight: bold;`;
                                    numbersOfLikes.innerHTML = `${x.data[0]}`;
                                    console.log(x.data[0]);
                                  }
                                  console.log(data.data.message);
                                })
                                .catch((error) => {
                                  return console.log(error);
                                });
                            })
                            .catch((error) => {
                              return console.log(error);
                            });
                        };

                        /////////////////////////////////////////////////////////////////////////////////////////////////

                        ///////////////////////////////Modifier un post//////////////////////////////////////////////////
                        let postUpdateActiv = false;

                        const UpdatePost = () => {
                          if (postUpdateActiv === false) {
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
                            const updateInput =
                              document.createElement("textarea");
                            updateInput.onchange = (e) => {
                              updateText = e.target.value;
                            };
                            updateInput.style = `
                            width:80%;
                            min-height: 75px;
                            `;
                            updateInput.placeholder = "Modifiez votre post !";
                            const updatePhoto = document.createElement("input");
                            updatePhoto.onchange = (e) =>
                              (updateImage = e.target.files) &
                              (updateFilesValue.innerHTML =
                                updateImage[0].name);
                            updatePhoto.type = "file";
                            updatePhoto.style = `
                            width:75px;
                            margin:10px;
                            `;

                            const updateFilesValue =
                              document.createElement("div");
                            updateFilesValue.style = `
                              width:80%;
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                              margin-bottom: 10px;
                                `;

                            const updateError = document.createElement("div");
                            updateError.id = "updateError";
                            const updateButton =
                              document.createElement("input");
                            updateButton.type = "submit";

                            updateContent.appendChild(updateForm);
                            updateForm.appendChild(updateInput);
                            updateForm.appendChild(updatePhoto);
                            updateForm.appendChild(updateFilesValue);
                            updateContent.appendChild(updateError);
                            updateForm.appendChild(updateButton);
                            postUpdateActiv = true;
                          } else {
                            updateContent.innerHTML = "";
                            postUpdateActiv = false;
                          }

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

                        ////////////////////////////////////////////////////////

                        ///////////////////////////////supprimer un post/////////
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
                        /////////////////////////////////////////////////////////////////

                        ////////////////////  Commentaires  //////////////////////////
                        let commentActiv = false;
                        const HandleComments = () => {
                          if (commentActiv === false) {
                            console.log(commentActiv);
                            commentActiv = true;
                            console.log("PosterId : " + PosterId);

                            const Error = document.createElement("div");
                            Error.style = `
                color: ${logColor.primary};
                margin:10px
                `;

                            let form = document.createElement("form");
                            form.style = `
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 20px;
                `;
                            form.onsubmit = (e) => {
                              PostComment(e);
                            };
                            let addComment = document.createElement("textarea");
                            addComment.style = `
                width:80%;
                height: 80px;
                `;
                            addComment.placeholder =
                              " Ajoutez un commentaire !!";
                            addComment.onchange = (e) => {
                              comment = e.target.value;
                            };

                            let buttonAddComment =
                              document.createElement("input");
                            buttonAddComment.type = "submit";
                            buttonAddComment.value = " Commenter";
                            buttonAddComment.style = `
                
                margin-top:15px;
                `;
                            const ErrorComment = document.createElement("div");

                            commentsContent.appendChild(Error);

                            commentsContent.appendChild(form);
                            form.appendChild(addComment);
                            form.appendChild(buttonAddComment);
                            form.appendChild(ErrorComment);
                            const divComments = document.createElement("div");
                            divComments.style = `
                                 
                                    margin-bottom: 20px;
                                    `;
                            commentsContent.appendChild(divComments);

                            //////////////// Affichage commentaires /////////////////
                            //requête comment avec l'id du post

                            const GetComments = () => {
                              axios({
                                method: "get",
                                url: `http://localhost:5000/api/post/comment/${element.postId}`,
                                withCredentials: true,
                              })
                                .then((data) => {
                                  let commentSort = data.data.sort(sortComment);
                                  console.log(commentSort);
                                  commentSort.forEach((el) => {
                                    //requête user avec l'id de l'utilisateur qui a poster le commentaire
                                    axios({
                                      method: "get",
                                      url: `http://localhost:5000/api/user/${el.posterId}`,
                                      withCredentials: true,
                                    })
                                      .then((dataUser) => {
                                        const divComment =
                                          document.createElement("div");
                                        divComment.style = `
                               
                                    margin-bottom: 20px;
                                    `;
                                        const allComments =
                                          document.createElement("div");
                                        const divUpdate =
                                          document.createElement("div");
                                        let buttonUpdateComment =
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

                                        let buttonDeleteComment =
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
                                        commentsContent.appendChild(Error);

                                        divComments.appendChild(divComment);

                                        divComment.appendChild(allComments);
                                        divComment.appendChild(divUpdate);
                                        if (PosterId === el.posterId) {
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

                                        const updateForm =
                                          document.createElement("form");
                                        const updateErrorComment =
                                          document.createElement("div");
                                        ///////////////////////////////Modifier un commentaire//////////////////////////////////////////////////

                                        let commentUpdateActiv = false;
                                        const updateComment = () => {
                                          if (commentUpdateActiv === false) {
                                            commentUpdateActiv = true;
                                            updateForm.onsubmit = (e) => {
                                              update(e);
                                            };
                                            updateForm.style = `
                                            display:flex;
                                            flex-direction: column;
                                            align-items:center;
                                            `;

                                            const updateInput =
                                              document.createElement(
                                                "textarea"
                                              );
                                            updateInput.onchange = (e) => {
                                              updateTextComment =
                                                e.target.value;
                                            };
                                            updateInput.style = `
                                            width:70%;
                                            height: 75px;
                                            margin-bottom: 15px;
                                            `;
                                            updateInput.placeholder =
                                              " Modifiez votre commentaire !";

                                            const updateButton =
                                              document.createElement("input");
                                            updateButton.type = "submit";
                                            divComment.appendChild(updateForm);
                                            updateForm.appendChild(updateInput);

                                            divComment.appendChild(
                                              updateErrorComment
                                            );
                                            updateForm.appendChild(
                                              updateButton
                                            );

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
                                            updateForm.innerHTML = "";
                                            updateErrorComment.innerHTML = "";
                                          }
                                        };

                                        ////////////////////////////////////////////////////////

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
                                  Error.innerHTML =
                                    "Aucun commentaire sur ce post";
                                  console.log(error);
                                });
                            };
                            GetComments();
                            ////////////////////  Poster un commentaire /////////////////////

                            const PostComment = (e) => {
                              e.preventDefault();

                              console.log(PosterId);
                              console.log("début postcomment");
                              console.log(element.postId);
                              console.log(comment);
                              if (comment === null) {
                                return (ErrorComment.innerHTML = `<p style="color :${logColor.primary}">Veuillez écrire un commentaire</p>`);
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
                                    if (Error) {
                                      Error.innerHTML = null;
                                    }
                                    if (ErrorComment) {
                                      ErrorComment.innerHTML = null;
                                    }
                                    addComment.value = "";
                                    divComments.innerHTML = "";
                                    console.log(addComment.value);
                                    comment = null;
                                    GetComments();
                                  })
                                  .catch((error) => {
                                    return console.log(error);
                                  });
                              } catch (error) {
                                console.log(error);
                              }
                              console.log("fin de postcomment");
                            };

                            /////////////////////////////////////////////////////////////////
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
                    return console.log(error);
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
    console.log("fin");
  }, []);

  return (
    <PageContent id="pageContent">
      <DivPost id="divPost"></DivPost>

      <PostsContent id="postsContent"></PostsContent>
    </PageContent>
  );
}

export default PostPage;
