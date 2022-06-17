import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../../logo/icon-modif-petite.png";
import { idContext } from "../appContext";
import PostPage from "./postPage-home";
import UpdateProfil from "./updateProfil-home";
import UsersPage from "./usersPage-home";
import Logout from "./logout-home";
import logColor from "../../style/color-style";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${logColor.secondary};
`;

const ImgLogo = styled.img`
  height: 100%;
  max-width: 600px;
  min-width: 200px;
  min-height: 50px;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
  border: 4px solid ${logColor.tertiary};
  border-left: none;
`;

const LinkContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px;
  padding: 12px;
  border: 3px solid ${logColor.tertiary};
  border-radius: 25px;
`;

const ImgProfil = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  overflow: hidden;
`;

const P = styled.p`
  text-align: center;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Ul = styled.ul`
  display: flex;

  align-items: center;
`;

const Li = styled.li`
  list-style-type: none;
`;

const NavBar = styled.input`
  width: 120px;
  font-weight: bold;
  color: white;
  background-color: ${logColor.tertiary};
  border-radius: 30px;
  border: hidden;
  margin: 10px;
  padding: 5px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    box-shadow: 2px 2px 2px white;
  }
`;

function Headers() {
  const id = useContext(idContext);
  const [img, setImg] = useState("");
  const [postPage, setPostPage] = useState(true);
  const [updateProfil, setUpdateProfil] = useState(false);
  const [usersPage, setUsersPage] = useState(false);
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/api/user/${id}`,
      withCredentials: true,
    }).then((data) => {
      setImg(data.data.photo);
    });
  });

  const handlePage = (e) => {
    if (e.target.id === "logout") {
      setPostPage(false);
      setUpdateProfil(false);
      setUsersPage(false);
      setLogout(true);
    }
    if (e.target.id === "updateProfil") {
      setPostPage(false);
      setUpdateProfil(true);
      setUsersPage(false);
      setLogout(false);
    }
    if (e.target.id === "postPage") {
      setPostPage(true);
      setUpdateProfil(false);
      setUsersPage(false);
      setLogout(false);
    }
    if (e.target.id === "usersPage") {
      setPostPage(false);
      setUpdateProfil(false);
      setUsersPage(true);
      setLogout(false);
    }
  };

  return (
    <div>
      <Header>
        <ImgLogo src={logo} />
        <div>
          <Ul>
            <Li>
              <NavBar
                id="postPage"
                type="submit"
                value="Publication"
                onClick={handlePage}
              />
            </Li>
            <Li>
              <NavBar
                id="usersPage"
                type="submit"
                value="Utilisateur"
                onClick={handlePage}
              />
            </Li>
            <Li>
              <NavBar
                type="submit"
                id="logout"
                value="Déconnexion"
                onClick={handlePage}
              />
            </Li>
          </Ul>
        </div>
        <LinkContent>
          <ImgProfil src={img} />
          <P id="updateProfil" onClick={handlePage}>
            Profil
          </P>
        </LinkContent>
      </Header>
      {postPage && <PostPage />}
      {updateProfil && <UpdateProfil />}
      {usersPage && <UsersPage />}
      {logout && <Logout />}
    </div>
  );
}

export default Headers;
