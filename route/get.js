const express = require("express");
const router = express.Router();
const Order = require("../mongo-db/ordershema");

// Get a single order by its ID
router.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Get a list of orders
router.post("/", async (req, res) => {
  try {
    const { userId, page, limit, history } = req.body;
    console.log(req.body);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Sort by descending order of createdAt field (recent time)
    };

    let query = {
      userId,
    };

    // If history is true, include cancelled and delivered orders
    if (history) {
      query.status = { $in: ["Cancelled", "Delivered", "Returned"] };
    } else {
      // Exclude cancelled and delivered orders
      query.status = { $nin: ["Cancelled", "Delivered"] };
    }

    const orders = await Order.paginate(query, options);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
