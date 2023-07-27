const express = require("express");
const router = express.Router();
const { userController, profileController } = require("../controller");
const { verifyToken, validateLogin, verifyRegister } = require("../middleware");
const { multerUpload, loginScheme, regisScheme } = require("../middleware");
const {
  changePasswordScheme,
  changeUserScheme,
  changeEmailScheme,
  changePhoneScheme,
  forgotPasswordScheme,
} = require("../middleware");

router.get("/", userController.getUsers);
//register-login
router.post("/", regisScheme, validateLogin, userController.register);
router.patch("/verify", verifyRegister, userController.verifikasiEmail);
router.post("/login", loginScheme, validateLogin, userController.login);
//ganti-ganti
router.patch(
  "/changeEmail",
  changeEmailScheme,
  validateLogin,
  verifyToken,
  userController.changeEmail
);
router.patch(
  "/changeUser",
  changeUserScheme,
  validateLogin,
  verifyToken,
  profileController.changeUser
);
router.patch(
  "/changePassword",
  changePasswordScheme,
  validateLogin,
  verifyToken,
  profileController.changePassword
);
router.patch(
  "/changePhone",
  changePhoneScheme,
  validateLogin,
  verifyToken,
  profileController.changePhone
);
router.patch(
  "/changeImage",
  verifyToken,
  multerUpload.single("avatars"),
  profileController.changeGambar
);
//lupa password
router.put(
  "/lupaPassword",
  forgotPasswordScheme,
  validateLogin,
  profileController.forgotPassword
);
router.patch(
  "/resetPassword",
  forgotPasswordScheme,
  validateLogin,
  verifyToken,
  profileController.resetPassword
);

module.exports = router;
