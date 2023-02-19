const router = require("express").Router();
const postController = require("../controllers/post.controller");

const fs = require("fs");

const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "./client/public/uploads/posts/" });

router.post("/", upload.single("file"), postController.create);
router.get("/", postController.getAllPost);
router.get("/:id", postController.info);
router.put("/:id", postController.update);
router.delete("/:id", postController.delete);
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);

//comentaire routes

router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports = router;
