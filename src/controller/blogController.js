const db = require("../models/");
const Blog = db.Blog;
const fs = require("fs").promises;
const database = [
  { model: db.Category, attributes: ["name"] },
  { model: db.Country, attributes: ["name"] },
  { model: db.User, attributes: ["user", "imgProfile"], as: `author` },
];

const setPagination = (page, limit) => {
  const offset = (page - 1) * limit;
  return {
    offset,
    limit: parseInt(limit),
  };
};

const blogController = {
  getBlogById: async (req, res) => {
    const { id } = req.params;
    try {
      const blog = await Blog.findOne({
        attributes: { exclude: ["categoryId", "countryId"] },
        where: { id },
        include: database,
      });
      if (!blog) return res.status(404).json("data tidak ada");

      return res
        .status(200)
        .json({ message: "data berhasil didapatkan", data: blog });
    } catch (err) {
      return res.status(500).json({ message: "data gagal didapatkan" });
    }
  },
  getBlogbyQuery: async (req, res) => {
    const { title, categoryId, orderBy, page = 1, limit = 10 } = req.query;
    const whereClause = {};
    if (title) whereClause.title = { [db.Sequelize.Op.like]: `%${title}%` };
    if (categoryId) whereClause.categoryId = categoryId;
    const pagination = setPagination(page, limit);
    try {
      const blog = await Blog.findAll({
        attributes: { exclude: ["categoryId", "countryId", "userId"] },
        where: whereClause,
        include: database,
        order: [["createdAt", orderBy || "DESC"]],
        ...pagination,
      });
      const row = await Blog.count({ where: whereClause });
      const totalPage = Math.ceil(row / limit);
      const tampil = { row, totalPage, page, limit };
      return res
        .status(200)
        .json({ message: "data blog", ...tampil, data: blog });
    } catch {
      return res.status(500).json({ message: "data gagal didapatkan" });
    }
  },
  createBlog: async (req, res) => {
    const user = await db.User.findByPk(req.user.id);
    if (!user.isVerified)
      return res.status(400).json({ message: "user belum verifikasi" });
    try {
      await db.sequelize.transaction(async (t) => {
        const result = await blogController.createBlog2(req, t);
        return res.status(200).json({ message: "Create Blog", data: result });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  createBlog2: async (req, t) => {
    const { title, content, videoUrl, keywords, categoryId, countryId } =
      req.body;
    const { path } = req.file;
    return await Blog.create(
      {
        title,
        content,
        videoUrl,
        keywords,
        categoryId,
        countryId,
        imgBlog: path,
        userId: req.user.id,
      },
      { transaction: t }
    );
  },

  deleteBlog: async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json("artikel tidak ada");
    if (blog.userId !== user.id)
      return res.status(403).json("Ini bukan tulisanmu");
    try {
      await db.sequelize.transaction(async (t) => {
        fs.unlink(blog.imgBlog, (err) => {
          return res.status(500).json({ message: "ada yang salah" });
        });
        await Blog.destroy({ where: { id }, transaction: t });
        return res.status(200).json({ message: "blog berhasil dihapus" });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = blogController;
