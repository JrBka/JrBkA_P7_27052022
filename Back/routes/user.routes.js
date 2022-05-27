const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const multer = require('../middleware/multer-config-profil');



//auth
router.post("/signup", authController.signup);
router.post("/login" ,authController.login);
router.get("/logout",auth, authController.logout);


//user
router.get("/",  auth ,userController.getAllUsers);
router.get("/:id", auth, userController.getOneUser);
router.put("/:id", auth, multer, userController.modifyUser);
router.delete("/:id", auth, userController.deleteUser);



module.exports = router;