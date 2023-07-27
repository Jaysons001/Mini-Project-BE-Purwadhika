const { Sequelize } = require("sequelize");
const db = require("../models/");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../helpers/transporter");
const path = require("path");
const fs = require("fs").promises;
const handlebars = require("handlebars");

const kirimEmailRegister = async (result, email) => {
  let payload = { id: result.id, isVerified: result.isVerified };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: `1h` });
  const redirect = `http://localhost:3000/verification?${token}`;
  const data = await fs.readFile(
    path.resolve(__dirname, "../email/registerEmail.html"),
    "utf-8"
  );
  const tempCompile = await handlebars.compile(data);
  const tempResult = tempCompile({ email, redirect });
  await transporter.sendMail({
    to: email,
    subject: "Selamat Datang di Purwadhika",
    html: tempResult,
  });
};

const cekRegister = async (req) => {
  const { user, email, password, confirmPassword, phone } = req.body;

  if (password !== confirmPassword) return "password tidak sama";

  const data = await User.findOne({
    where: { [Sequelize.Op.or]: [{ user }, { email }, { phone }] },
  });

  if (data) return "user, email, atau phone telah terdaftar";
};

const cekLogin = async (req) => {
  const { email, password, user, phone } = req.body;

  const kondisiWhere = {};
  if (user) kondisiWhere.user = user;
  if (email) kondisiWhere.email = email;
  if (phone) kondisiWhere.phone = phone;

  const checkLogin = await User.findOne({ where: kondisiWhere });

  if (checkLogin) {
    const isValid = await bcrypt.compare(password, checkLogin.password);
    return { checkLogin, isValid, message: "password salah" };
  }

  return { checkLogin, isValid: false, message: "tidak terdaftar" };
};

const userController = {
  getUsers: async (req, res) => {
    try {
      const result = await User.findAll();

      return res
        .status(200)
        .json({ message: "data berhasil didapatkan", data: result });
    } catch (err) {
      return res.status(500).json({ message: "data gagal didapatkan" });
    }
  },

  register: async (req, res) => {
    const { user, email, password, phone } = req.body;
    const regis = await cekRegister(req);
    if (regis) return res.status(400).json({ message: regis });
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await db.sequelize.transaction(async (t) => {
        const result = await User.create(
          { user, email, password: hashPassword, phone },
          { transaction: t }
        );
        await kirimEmailRegister(result, email);
        return res
          .status(200)
          .json({ message: "register berhasil", data: result });
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "registrasi gagal", error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { isValid, checkLogin, message } = await cekLogin(req);
      if (!isValid || !checkLogin)
        return res.status(400).json({ message: message });
      let payload = { id: checkLogin.id, user: checkLogin.user };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: `1h`,
      });

      return res.status(200).json({ message: "login berhasil", data: token });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Login Gagal", error: err.message });
    }
  },

  verifikasiEmail: async (req, res) => {
    try {
      const { id } = req.user;
      await User.update({ isVerified: true }, { where: { id } });
      return res.status(200).json({ message: "verifikasi berhasil" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  changeEmail: async (req, res) => {
    const { email, emailBaru } = req.body;
    const { id } = req.user;
    try {
      const user = await User.findOne({ where: { id } });
      if (user.email !== email)
        return res.status(400).json({ message: "ini bukan email pengguna" });
      const allUser = await User.findAll({ where: { email: emailBaru } });
      if (allUser.length > 0)
        return res.status(500).json({ message: "email sudah digunakan" });
      await db.sequelize.transaction(async (t) => {
        await User.update(
          { email: emailBaru, isVerified: false },
          { where: { id } }
        );
        await kirimEmailRegister(user, emailBaru), { transaction: t };
      });
      return res.status(200).json({ message: "email berhasil diubah" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userController;
