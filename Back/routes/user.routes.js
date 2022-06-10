const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const multer = require("../middleware/multer-config-profil");

//auth.auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", auth.auth, authController.logout);

//user
router.get("/", auth.auth, userController.getUsers);
router.get("/:id", auth.auth, userController.getUser);
router.put("/:id", auth.auth, multer, userController.modifyUser);
router.delete("/:id", auth.auth, userController.deleteUser);

module.exports = router;
