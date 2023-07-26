const db = require("../models/");
const Category = db.Category;

const categoryController = {
  buatCategory: async (req, res) => {
    const { name } = req.body;
    try {
      await db.sequelize.transaction(async (t) => {
        const result = await Category.create({ name }, { transaction: t });

        return res.status(200).json({
          message: "kategori baru berhasil dibuat",
          data: result,
        });
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "kategori baru tidak berhasil dibuat" });
    }
  },

  getCategory: async (req, res) => {
    try {
      const result = await Category.findAll();
      return res
        .status(200)
        .json({ message: "data berhasil didapatkan", data: result });
    } catch {
      return res
        .status(500)
        .json({ message: "data tidak berhasil didapatkan" });
    }
  },
};

module.exports = categoryController;
