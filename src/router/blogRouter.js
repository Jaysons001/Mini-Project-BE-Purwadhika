const router = require("express").Router();

const { blogController } = require("../controller");
const { verifyToken, multerUpload } = require("../middleware");
// /blog
router.get("/:id", blogController.getBlogById);
router.get("/", blogController.getBlogbyQuery);
router.post(
  "/",
  verifyToken,
  multerUpload.single("imgBlog"),
  blogController.createBlog
);
router.delete("/:id", verifyToken, blogController.deleteBlog);

module.exports = router;
