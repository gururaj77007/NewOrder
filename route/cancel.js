const express = require("express");
const router = express.Router();
const Order = require("../mongo-db/ordershema");

// GET /orders/:userId
router.post("/", async (req, res) => {
  const { orderId, cancellationReason } = req.body;
  console.log(orderId);

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Cancelled";
    order.cancellationReason = cancellationReason;
    await order.save();

    return res.json({ message: "Order canceled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error canceling order", error });
  }
});

module.exports = router;
