const db = require("../config/db");
const tableController = require("./tableController");

function bind(table, handler) {
  return (req, res, next) => {
    req.params.table = table;
    return handler(req, res, next);
  };
}

exports.getBannerPromos = async (req, res) => {
  try {
    const [bannerPromos] = await db.query(`
      SELECT
        id,
        title,
        imageUrl,
        url,
        displayOrder,
        isActive,
        createdAt,
        updatedAt
      FROM banner_promos
      WHERE isActive = 1
      ORDER BY displayOrder ASC, id DESC
    `);

    return res.json({
      success: true,
      data: bannerPromos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get banner promos",
      error: error.message,
    });
  }
};

exports.getBannerPromoById = async (req, res) => {
  try {
    const [bannerPromos] = await db.query(
      `
        SELECT
          id,
          title,
          imageUrl,
          url,
          displayOrder,
          isActive,
          createdAt,
          updatedAt
        FROM banner_promos
        WHERE id = ?
        LIMIT 1
      `,
      [req.params.id],
    );

    if (bannerPromos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Banner promo not found",
      });
    }

    return res.json({
      success: true,
      data: bannerPromos[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get banner promo",
      error: error.message,
    });
  }
};

exports.createBannerPromo = bind("banner_promos", tableController.create);
exports.updateBannerPromo = bind("banner_promos", tableController.update);
exports.deleteBannerPromo = bind("banner_promos", tableController.remove);
