const router = require("express").Router();

const { categoryController } = require("../controller");
const { verifyToken, isAdmin } = require("../middleware");

router.post("/buat", verifyToken, isAdmin, categoryController.buatCategory);
router.get("/get", categoryController.getCategory);

module.exports = router;
