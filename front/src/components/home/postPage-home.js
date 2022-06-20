import axios from "axios";
import FormData from "form-data";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import logColor from "../../style/color-style";
import { idContext } from "../appContext";

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
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

const Textarea = styled.textarea`
  height: 100px;
  width: 80%;
  margin: 10px;
`;

const Input = styled.input`
  margin: 10px;
`;

let comment = "";
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

function PostPage() {
  PosterId = useContext(idContext);

  useEffect(() => {
    //////////////////// Posts ///////////////////////////
    //requête posts

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
                      const postsContent =
                        document.getElementById("postsContent");
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
                      posterContent.style =
                        "width:100%;" +
                        "display: flex;" +
                        "justify-content: space-between;" +
                        `border-bottom: 1px solid ${logColor.secondary};` +
                        "align-items: center;";

                      const buttonUpdate = document.createElement("input");
                      buttonUpdate.type = "submit";
                      buttonUpdate.value = "modifier";
                      buttonUpdate.onclick = () => {
                        updatePost();
                      };
                      buttonUpdate.style = `
              height: 100%;
              `;

                      const buttonDelete = document.createElement("input");
                      buttonDelete.type = "submit";
                      buttonDelete.value = "supprimer";
                      buttonDelete.onclick = () => {
                        deletePost();
                      };
                      buttonDelete.style = `
              height: 100%;
              `;

                      const like = document.createElement("div");
                      if (dataLikers.data) {
                        const userLiker = dataLikers.data.map((e) => e.likerId);
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
                          font-weight: bold;`;
                        }
                      }
                      like.onclick = () => {
                        handleLikes();
                      };

                      const numbersOfLikes = document.createElement("div");

                      const posterId = document.createElement("p");
                      posterId.style = "margin:10px;";

                      const updateContent = document.createElement("div");

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
                      buttonComments.style =
                        " width:100px;" + "margin-bottom:20px;";
                      buttonComments.onclick = () => {
                        HandleComments();
                      };
                      const commentsContent = document.createElement("div");
                      commentsContent.style = `width: 100%;`;

                      postsContent.appendChild(postContent);
                      postContent.appendChild(posterContent);
                      posterContent.appendChild(posterId);
                      if (PosterId == element.posterId) {
                        posterContent.appendChild(buttonUpdate);
                        posterContent.appendChild(buttonDelete);
                      }
                      posterContent.appendChild(like);
                      posterContent.appendChild(numbersOfLikes);
                      posterContent.appendChild(updateContent);
                      if (element.photo) {
                        postContent.appendChild(postPhoto);
                      }
                      if (element.texte) {
                        postContent.appendChild(postTexte);
                      }
                      postContent.appendChild(buttonComments);
                      postContent.appendChild(commentsContent);

                      posterId.innerHTML = `Posté par : ${dataUser.data.pseudo}`;
                      like.innerHTML = `<i class="fas fa-heart"></i>`;

                      numbersOfLikes.innerHTML = `${dataLike.data[0]}`;

                      if (element.photo) {
                        postPhoto.innerHTML = `<img  src="${element.photo}" alt="photo de profil" /> `;
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
                      const updatePost = () => {
                        const updateForm = document.createElement("form");
                        updateForm.onsubmit = (e) => {
                          Update(e);
                        };
                        const updateInput = document.createElement("textarea");
                        updateInput.onchange = (e) => {
                          updateText = e.target.value;
                        };
                        const updatePhoto = document.createElement("input");
                        updatePhoto.onclick = (e) => {
                          updateImage = e.target.files;
                        };
                        updatePhoto.type = "file";
                        const updateError = document.createElement("div");
                        updateError.id = "updateError";
                        const updateButton = document.createElement("input");
                        updateButton.type = "submit";
                        updateContent.appendChild(updateForm);
                        updateForm.appendChild(updateInput);
                        updateForm.appendChild(updatePhoto);
                        updateContent.appendChild(updateError);
                        updateForm.appendChild(updateButton);
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
                                alert("Post modifié");
                                window.location = "/home";
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
                              window.location = "/home";
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

                      let activ = false;
                      const HandleComments = () => {
                        console.log("PosterId : " + PosterId);

                        const Error = document.createElement("div");
                        Error.style = `
                color: ${logColor.primary}
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
                height: 100px;
                `;
                        addComment.placeholder = " Ajoutez un commentaire !!";
                        addComment.onchange = (e) => {
                          comment = e.target.value;
                        };

                        let buttonAddComment = document.createElement("input");
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
                            data.data.forEach((el) => {
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
                                  commentsContent.appendChild(divComment);
                                  divComment.appendChild(allComments);
                                  divComment.appendChild(divUpdate);
                                  if (PosterId == el.posterId) {
                                    divUpdate.appendChild(buttonUpdateComment);
                                    divUpdate.appendChild(buttonDeleteComment);
                                  }
                                  allComments.innerHTML = `
                          <p>Commentaire écrit par :   <span style="color: ${logColor.primary}">${dataUser.data.pseudo}</span></p>
                          <p>${el.text}</p>`;

                                  ///////////////////////////////Modifier un commentaire//////////////////////////////////////////////////
                                  const updateComment = () => {
                                    const updateForm =
                                      document.createElement("form");
                                    updateForm.onsubmit = (e) => {
                                      update(e);
                                    };
                                    const updateInput =
                                      document.createElement("textarea");
                                    updateInput.onchange = (e) => {
                                      updateTextComment = e.target.value;
                                    };

                                    const updateErrorComment =
                                      document.createElement("div");
                                    updateErrorComment.id =
                                      "updateErrorComment";
                                    const updateButton =
                                      document.createElement("input");
                                    updateButton.type = "submit";
                                    divComment.appendChild(updateForm);
                                    updateForm.appendChild(updateInput);

                                    divComment.appendChild(updateErrorComment);
                                    updateForm.appendChild(updateButton);

                                    const update = (e) => {
                                      e.preventDefault();
                                      try {
                                        const updateErrorComment =
                                          document.getElementById(
                                            "updateErrorComment"
                                          );
                                        if (updateTextComment == null) {
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
                                            console.log(data);
                                            alert("Commentaire modifié");
                                            window.location = "/home";
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

                                  //////////////////////////////Supprimer un commentaire///////////
                                  const deleteComment = () => {
                                    try {
                                      axios({
                                        method: "delete",
                                        url: `http://localhost:5000/api/post/comment/${el.id}`,
                                        withCredentials: true,
                                      })
                                        .then((data) => {
                                          alert("Commentaire supprimé");
                                          window.location = "/home";
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
                            Error.innerHTML = "Aucun commentaire sur ce post";
                            console.log(error);
                          });

                        ////////////////////  Poster un commentaire /////////////////////

                        const PostComment = (e) => {
                          e.preventDefault();

                          console.log(PosterId);
                          console.log("début postcomment");
                          console.log(element.postId);
                          console.log(comment);
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
                                return console.log(data);
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

                        /////////////////////////////////////////////////////////////////
                      };
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

    console.log("fin");
  }, []);

  //////////////////////////////Post///////////////////////////////
  const Post = (e) => {
    e.preventDefault();

    try {
      const postError = document.getElementById("postError");
      if (postText == null && postPhoto == null) {
        return (postError.innerHTML = `<p style="color :${logColor.primary}">Veuillez ajouter du texte ou une image</p>`);
      }
      let bodyFormData = new FormData();
      bodyFormData.append("posterId", PosterId);
      if (postText == null) {
        console.log("ok");
      }
      if (postText != null) {
        console.log("ne doit pas se loger");
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
          window.location = "/home";
        })
        .catch((error) => {
          return console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  /////////////////////////////////////////////////////////////////
  return (
    <PageContent id="postsContent">
      <Form
        onSubmit={(e) => {
          Post(e);
        }}
      >
        <label>Post</label>
        <Textarea
          onChange={(e) => {
            postText = e.target.value;
          }}
          placeholder="Ecrivez votre post ici !"
        />
        <Input type="file" onClick={(e) => (postPhoto = e.target.files)} />
        <div id="postError"></div>
        <Input type="submit" value="Poster !" />
      </Form>
    </PageContent>
  );
}

export default PostPage;
