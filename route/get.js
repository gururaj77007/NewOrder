const express = require("express");
const router = express.Router();
const Order = require("../mongo-db/ordershema");

// GET /orders/:userId
router.post("/", async (req, res) => {
  try {
    const { userId, page, limit } = req.body;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Sort by descending order of createdAt field (recent time)
    };

    const query = {
      userId,
      status: { $nin: ["declined", "delivered"] }, // Exclude orders with status "declined" or "delivered"
    };

    const orders = await Order.paginate(query, options);
    console.log(orders.page);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
