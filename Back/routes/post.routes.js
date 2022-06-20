const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controllers");
const commentController = require("../controllers/comment.controllers");
const multer = require("../middleware/multer-config-posts");

//post
router.get("/", auth.auth, postController.getPosts);
router.post("/", auth.auth, multer, postController.createPost);
router.put("/:id", auth.auth, multer, postController.modifyPost);
router.delete("/:id", auth.auth, postController.deletePost);

//like/unlike
router.post("/like/:id", auth.auth, likeController.likeUnlike);
router.get("/like/:id", auth.auth, likeController.numbersOflike);
router.get("/likers/:id", auth.auth, likeController.likers);

//comments
router.post("/comment", auth.auth, commentController.createComment);
router.get("/comment", auth.auth, commentController.getComments);
router.get("/comment/:id", auth.auth, commentController.getComment);
router.put("/comment/:id", auth.auth, commentController.modifyComment);
router.delete("/comment/:id", auth.auth, commentController.deleteComment);

module.exports = router;
