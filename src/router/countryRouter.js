const router = require("express").Router();
const { countryController } = require("../controller");
const { verifyToken, isAdmin } = require("../middleware");

router.post("/", verifyToken, isAdmin, countryController.buatCountry);
router.get("/", countryController.getCountry);

module.exports = router;
