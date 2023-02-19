const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const express = require("express");
const app = express();
const fs = require("fs");

const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "./client/public/uploads/profil/" });

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(`${__dirname}/cleint`));

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "client/public/uploads/profils/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${req.body.userId}.jpg`)
//     }
// });

// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg") {
//         cb(null, true);
//     } else {
//         cb(new Error("Not a image File!!"), false);
//     }
// };

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
// });

//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logOut);

//all user databases
router.get("/", userController.getAllUsers);
// user info
router.get("/:id", userController.userInfo);
//update
router.put("/:id", userController.updateUser);
//delete user
router.delete("/:id", userController.deleteUser);
//foller and unfollower
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

//upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

// router.post('/upload', upload.single('file'), function (req, res) {
//     const path = "./"+req.file.path;
//     const fileName = req.file.destination + "" + req.body.name + ".jpeg";
//     console.log(path);

//     fs.rename(path, fileName, (err) => {
//         if (err) console.log(err)
//     })

//     res.send({fileName,path});

//     console.log(req.file, req.body)
// });

module.exports = router;
