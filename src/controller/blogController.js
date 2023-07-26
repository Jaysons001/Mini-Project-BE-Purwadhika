const db = require("../models/");
const Blog = db.Blog;

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
        attributes: { exclude: ["categoryId"] },
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

  createBlog: async (req, res) => {
    const { title, content, videoUrl, keywords, categoryId, countryId } =
      req.body;
    const { path } = req.file;
    try {
      await db.sequelize.transaction(async (t) => {
        const result = await Blog.create(
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
        return res
          .status(200)
          .json({ message: "Blog berhasil dibuat", data: result });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
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
      return res
        .status(200)
        .json({ message: "data berhasil didapatkan", page, limit, data: blog });
    } catch {
      return res.status(500).json({ message: "data gagal didapatkan" });
    }
  },
};

module.exports = blogController;
