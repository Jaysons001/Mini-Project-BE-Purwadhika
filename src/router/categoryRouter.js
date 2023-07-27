const router = require("express").Router();

const { categoryController } = require("../controller");
const { verifyToken, isAdmin } = require("../middleware");

router.post("/", verifyToken, isAdmin, categoryController.buatCategory);
router.get("/", categoryController.getCategory);

module.exports = router;
