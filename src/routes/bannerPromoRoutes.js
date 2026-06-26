const express = require("express");
const bannerPromoController = require("../controllers/bannerPromoController");

const router = express.Router();

router.get("/", bannerPromoController.getBannerPromos);
router.get("/:id", bannerPromoController.getBannerPromoById);
router.post("/", bannerPromoController.createBannerPromo);
router.put("/:id", bannerPromoController.updateBannerPromo);
router.delete("/:id", bannerPromoController.deleteBannerPromo);

module.exports = router;
