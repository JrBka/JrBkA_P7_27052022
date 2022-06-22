import axios from "axios";

//déconnexion
function Logout() {
  axios({
    method: "get",
    url: `http://localhost:5000/api/user/logout`,
    withCredentials: true,
  }).then((data) => {
    console.log(data.data.message);
    window.location = "/";
  });
}

export default Logout;
