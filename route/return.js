const express = require("express");
const Order = require("../mongo-db/ordershema"); // Import your Order model

const router = express.Router();

// Define a route to get orders with "Return Requested" status and a specific return reason
router.get("/", async (req, res) => {
  try {
    const { returnReason, orderId } = req.query;

    // Query the database to find orders with the specified status and return reason
    const order = await Order.findById(orderId);
    (order.status = "Return Requested"), (order.returnReason = returnReason);
    await order.save();

    if (order.length === 0) {
      return res.status(404).json({ message: "No orders match the criteria." });
    }
    console.log(order);

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
