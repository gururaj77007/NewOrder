const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  ProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "Profile",
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Size: {
    type: String,
    default: "",
  },
  TotalPrice: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    // ref: "User",
    required: true,
  },
  profileIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Profile",
      required: true,
    },
  ],
  products: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  shippingAddress: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "pending", // Set the default value for status
  },
});
orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
