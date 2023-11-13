const express = require("express");
const router = express.Router();
const Order = require("../mongo-db/ordershema");
const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.razorpay_keyid,
  key_secret: process.env.razorpay_key_secret,
});

// Create an order
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      products,
      shippingAddress,
      paymentMethod,
      GrandTotal,
      houseId,
      Quantity,
    } = req.body;

    const createdOrder = await Order.create({
      userId,
      houseId,
      products,
      shippingAddress,
      paymentMethod,
      GrandTotal,
      Quantity,
    });
    if (paymentMethod !== "COD") {
      const amount = GrandTotal * 100;

      const orderOptions = {
        amount,
        currency: "INR",
        receipt: "receipt#1",
      };

      razorpay.orders.create(orderOptions, (err, order) => {
        res.status(201).json({ order, ordermongoID: createdOrder._id });
      });
    } else {
      res.status(201).json({ ordermongoID: createdOrder._id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/cancel", async (req, res) => {
  const { ordermongoID } = req.body;
  try {
    const response = await Order.deleteOne({ _id: ordermongoID });
    console.log(response);

    if (response.deletedCount == 1) {
      res.status(200).json({ message: "Order cancelled successfully." });
    } else {
      res.status(400).json({ message: "Failed to cancel the order." });
    }
  } catch (error) {
    console.error("An error occurred while cancelling the order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/confirm", async (req, res) => {
  try {
    const { orderId, paymentData, order_mongoID } = req.body;
    console.log(orderId, paymentData, order_mongoID);

    function computeSignature(order_id, razorpay_payment_id) {
      const secret = process.env.razorpay_key_secret;
      const text = order_id + "|" + razorpay_payment_id;

      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(text)
        .digest("hex");

      return generated_signature;
    }

    const generated_signature = computeSignature(
      paymentData.razorpay_order_id,
      paymentData.razorpay_payment_id
    );

    if (generated_signature !== paymentData.razorpay_signature) {
      console.log(generated_signature, paymentData.razorpay_signature);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order_mongoID,
      { $set: { paymentId: paymentData } },
      { new: true }
    ).catch((e) => {
      console.log(e);
    });

    console.log("Order updated successfully");

    if (updatedOrder) {
      res.status(200).json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
