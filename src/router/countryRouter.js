const router = require("express").Router();
const { countryController } = require("../controller");
const { verifyToken, isAdmin } = require("../middleware");

router.post("/buat", verifyToken, isAdmin, countryController.buatCountry);
router.get("/get", countryController.getCountry);

module.exports = router;
