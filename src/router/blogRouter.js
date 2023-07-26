const router = require("express").Router();

const { blogController } = require("../controller");
const { verifyToken, multerUpload } = require("../middleware");

router.get("/get/:id", blogController.getBlogById);
router.get("/get", blogController.getBlogbyQuery);
router.post(
  "/buat",
  verifyToken,
  multerUpload.single("imgBlog"),
  blogController.createBlog
);

module.exports = router;
