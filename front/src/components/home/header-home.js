import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../../logo/icon-modif-petite.png";
import logoFooter from "../../logo/logo-monochrome-modif.png";
import { idContext } from "../appContext";
import PostPage from "./postPage-home";
import UpdateProfil from "./updateProfil-home";
import UsersPage from "./usersPage-home";
import Logout from "./logout-home";
import logColor from "../../style/color-style";

// composant stylisé

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${logColor.primary};
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-width: 30%;
  width: 60%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const ImgLogo = styled.img`
  height: 100%;
  width:100%
  max-width: 400px;
  min-width: 250px;
  min-height: 50px;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
  border: 4px solid ${logColor.tertiary};
  border-left: none;
  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border: none;
    border-radius: 20px;
    margin: 0;
  }
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
  background-color: ${logColor.secondary};
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
  width: 100%;
  flex-flow: row wrap;
  min-width: 150px;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const Li = styled.li`
  list-style-type: none;
  margin: 10px;
`;

const NavBar = styled.input`
  font-weight: bold;
  color: ${logColor.tertiary};
  background-color: ${logColor.secondary};
  border-radius: 30px;
  border: hidden;
  margin: 0;
  padding: 6px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    box-shadow: 2px 2px 2px ${logColor.tertiary};
  }
`;
const Footer = styled.footer`
  margin-top: 20px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${logColor.primary};
`;
const LogoFooter = styled.img`
  width: 50%;
  height: "";
`;

// Gestion navBar
const srcDefault = "http://localhost:5000/images/profil/profil.jpg";

function Headers() {
  const id = useContext(idContext);
  const [img, setImg] = useState("");
  if (img == "" || img == null) {
    setImg(srcDefault);
  }
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
        <ImgLogo src={logo} alt="Logo" />
        <NavContent>
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
            <ImgProfil src={img} alt="Photo de profil" />
            <P id="updateProfil" onClick={handlePage}>
              Profil
            </P>
          </LinkContent>
        </NavContent>
      </Header>
      {postPage && <PostPage />}
      {updateProfil && <UpdateProfil />}
      {usersPage && <UsersPage />}
      {logout && <Logout />}
      <Footer>
        <LogoFooter src={logoFooter} alt="Logo noir" />
      </Footer>
    </div>
  );
}

export default Headers;
