const db = require("../models/");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../helpers/transporter");
const path = require("path");
const fs = require("fs").promises;
const handlebars = require("handlebars");

const kirimEmailUser = async (iniUser, newUser) => {
  const data = await fs.readFile(
    path.resolve(__dirname, "../email/perubahan.html"),
    "utf-8"
  );
  const tempCompile = await handlebars.compile(data);
  const tempResult = tempCompile({
    key: `usernamemu, dari ${iniUser.user} ke ${newUser}`,
  });

  await transporter.sendMail({
    to: iniUser.email,
    subject: "Perubahan pada akun",
    html: tempResult,
  });
};

const kirimEmaiPassword = async (email) => {
  const data = await fs.readFile(
    path.resolve(__dirname, "../email/perubahan.html"),
    "utf-8"
  );
  const tempCompile = await handlebars.compile(data);
  const tempResult = tempCompile({
    key: `passwordmu`,
  });

  await transporter.sendMail({
    to: email,
    subject: "Perubahan pada akun",
    html: tempResult,
  });
};

const kirimEmaiPhone = async (email) => {
  const data = await fs.readFile(
    path.resolve(__dirname, "../email/perubahan.html"),
    "utf-8"
  );
  const tempCompile = await handlebars.compile(data);
  const tempResult = tempCompile({
    key: `nomor ponselmu`,
  });

  await transporter.sendMail({
    to: email,
    subject: "Perubahan pada akun",
    html: tempResult,
  });
};

const profileController = {
  changeUser: async (req, res) => {
    const { oldUser, newUser } = req.body;

    const iniUser = await User.findOne({ where: { id: req.user.id } });
    if (!iniUser) return res.status(400).json({ message: "anda bukan user" });

    const sameUser = await User.findOne({ where: { user: newUser } });
    if (sameUser) return res.status(400).json({ message: "user sudah ada" });
    try {
      const result = await User.update(
        { user: newUser },
        { where: { id: req.user.id } }
      );

      await kirimEmailUser(iniUser, newUser);

      return res.status(200).json({ message: "Username dirubah" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkOldPassword)
      return res.status(400).json({ message: "passwordmu salah" });
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "confirm yang benar" });
    try {
      const salt = await bcrypt.genSalt(10);
      const hashNewPassword = await bcrypt.hash(newPassword, salt);
      await db.sequelize.transaction(async (t) => {
        await User.update({ password: hashNewPassword }, { where: { id } });
        await kirimEmaiPassword(user.email), { transaction: t };
      });
      return res.status(200).json({ message: "password berhasil dirubah" });
    } catch {
      return res.status(500).json({ message: "ada yang salah" });
    }
  },

  changePhone: async (req, res) => {
    const { phone, newPhone } = req.body;
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user.phone !== phone)
      return res.status(400).json({ message: "nomor ponsel tidak sama" });
    try {
      await User.update({ phone: newPhone }, { where: { id: req.user.id } });
      await kirimEmaiPhone(user.email);
      return res.status(200).json({ message: "nomor ponsel berhasil dirubah" });
    } catch {
      return res.status(500).json({ message: "update nomor ponsel gagal" });
    }
  },

  changeGambar: async (req, res) => {
    try {
      const { id } = req.user;
      const avatarlama = await User.findOne({ where: { id } });
      if (avatarlama.imgProfile) {
        fs.unlink(avatarlama.imgProfile, (err) => {
          if (err) return res.status(500).json({ message: "ada yang salah" });
        });
      }
      await db.sequelize.transaction(async (t) => {
        const result = await User.update(
          { imgProfile: req.file.path },
          { where: { id } },
          { transaction: t }
        );
      });
      return res.status(200).json({ message: "gambar berhasil dirubah" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "ganti gambar salah", error: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: "user tidak ada" });
      let payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_Key, { expiresIn: `1h` });
      const redirect = `http://localhost:3000/forgotPassword?${token}`;
      const data = await fs.readFile(
        path.resolve(__dirname, "../email/forgotpass.html"),
        "utf-8"
      );
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ email, redirect });
      await transporter.sendMail({
        to: email,
        subject: "Forgot Password Blogmu",
        html: tempResult,
      });
      return res.status(200).json({ message: "Silahkan cek email" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  resetPassword: async (req, res) => {
    let { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password tidak sama" });

    const { id } = req.user;
    try {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      await User.update({ password }, { where: { id } });
      return res.status(200).json({ message: "password berhasil dirubah" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = profileController;
