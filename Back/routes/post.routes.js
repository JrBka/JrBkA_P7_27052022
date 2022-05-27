const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controllers");
const commentController = require("../controllers/comment.controllers");
const multer = require("../middleware/multer-config-posts");

//post
router.get("/", auth, postController.getAllPost);
router.post("/", auth, multer, postController.createPost);
router.put("/:id", auth, multer, postController.modifyPost);
router.delete("/:id", auth, postController.deletePost);

//like/unlike
router.post("/like/:id", auth, likeController.likeUnlike);
router.get("/like/:id", auth, likeController.numbersOflike);

//comments
router.post("/comment", auth, commentController.createComment);
router.get("/comment", auth, commentController.getAllComment);
router.get("/comment/:id", auth, commentController.getOneComment);
router.put("/comment/:id", auth, commentController.modifyComment);
router.delete("/comment/:id", auth, commentController.deleteComment);

module.exports = router;
