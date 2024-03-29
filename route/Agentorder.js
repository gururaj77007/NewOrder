// orderRoutes.js

const express = require("express");
const router = express.Router();
const Order = require("../mongo-db/ordershema"); // Make sure to provide the correct path to your order model

// Route to assign shipping agent ID to an order using a GET request
router.get("/assign-shipping-agent/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { shippingAgentId } = req.query;
  console.log(orderId, shippingAgentId);

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Assign the shipping agent ID to the order
    order.shippingagentid = shippingAgentId;
    order.status = "Order Dispatched";

    // Save the updated order
    await order.save();

    return res
      .status(200)
      .json({ message: "Shipping agent assigned successfully", order });
  } catch (error) {
    console.error("Error assigning shipping agent:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/orders/:profileIds", async (req, res) => {
  try {
    const { profileIds } = req.params;

    // Find orders with matching profileIds, sorted by createdAt in descending order
    const orders = await Order.find({ profileIds: { $in: [profileIds] } }).sort(
      { createdAt: -1 }
    ); // Sort by createdAt in descending order

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No orders found for the given profileIds" });
    }

    // Respond with the orders
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
