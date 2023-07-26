const { body, validationResult } = require("express-validator");

const loginScheme = [
  body("password").notEmpty().withMessage("password tidak boleh kosong"),
  body("user")
    .if(body("user").exists())
    .exists()
    .withMessage("user tidak boleh kosong"),
  body("email")
    .if(body("email").exists())
    .isEmail()
    .withMessage("email tidak boleh salah"),
  body("phone")
    .if(body("phone").exists())
    .exists()
    .withMessage("phone tidak boleh kosong")
    .isMobilePhone()
    .withMessage("phone tidak valid"),
];

const regisScheme = [
  body("user").notEmpty().withMessage("user tidak boleh kosong"),
  body("email").isEmail().notEmpty().withMessage("email tidak boleh kosong"),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .bail()
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password harus 1 huruf besar, 1 huruf kecil, dengan 1 symbol"
    ),
  body("phone").notEmpty().withMessage("phone tidak boleh kosong"),
  body("confirmPassword").notEmpty().withMessage("password tidak boleh kosong"),
];

const changePasswordScheme = [
  body("oldPassword").notEmpty().withMessage("password tidak boleh kosong"),
  body("newPassword")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .bail()
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password harus 1 huruf besar, 1 huruf kecil, dengan 1 symbol"
    ),
  body("confirmNewPassword")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .bail()
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password harus 1 huruf besar, 1 huruf kecil, dengan 1 symbol"
    ),
];

const changeUserScheme = [
  body("oldUser").notEmpty().withMessage("user tidak boleh kosong"),
  body("newUser").notEmpty().withMessage("user tidak boleh kosong"),
];

const changeEmailScheme = [
  body("email")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .bail()
    .trim()
    .isEmail(),
  body("emailBaru")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .bail()
    .trim()
    .isEmail(),
];

const changePhoneScheme = [
  body("phone")
    .notEmpty()
    .withMessage("phone tidak boleh kosong")
    .bail()
    .trim()
    .isMobilePhone()
    .withMessage("phone tidak valid"),
  body("newPhone")
    .notEmpty()
    .withMessage("phone tidak boleh kosong")
    .bail()
    .trim()
    .isMobilePhone()
    .withMessage("phone tidak valid"),
];

const forgotPasswordScheme = [
  body("email")
    .if(body("email").exists())
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .bail()
    .trim()
    .isEmail(),
  body("password")
    .if(body("password").exists())
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .bail()
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password harus 1 huruf besar, 1 huruf kecil, dengan 1 symbol"
    ),
  body("confirmPassword")
    .if(body("confirmPassword").exists())
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .bail()
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password harus 1 huruf besar, 1 huruf kecil, dengan 1 symbol"
    ),
];

const validateLogin = (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length > 0) return res.status(400).json({ message: errors });

  next();
};

module.exports = {
  validateLogin,
  changePasswordScheme,
  changeUserScheme,
  loginScheme,
  regisScheme,
  changeEmailScheme,
  changePhoneScheme,
  forgotPasswordScheme,
};
