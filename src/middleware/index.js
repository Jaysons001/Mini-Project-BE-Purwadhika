const { verifyToken, verifyRegister, isAdmin } = require("./auth");
const { multerUpload } = require("./multer");
const {
  loginScheme,
  validateLogin,
  regisScheme,
  changePasswordScheme,
  changeUserScheme,
  changeEmailScheme,
  changePhoneScheme,
  forgotPasswordScheme,
} = require("./validation");

module.exports = {
  verifyToken,
  isAdmin,
  verifyRegister,
  validateLogin,
  loginScheme,
  regisScheme,
  multerUpload,
  changePasswordScheme,
  changeUserScheme,
  changeEmailScheme,
  changePhoneScheme,
  forgotPasswordScheme,
};
