const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // Default discount value is 0
  },
  houseId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  imageUrl: {
    type: String,
  },
  discountPercentage: {
    type: Number,
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
      type: String,
      // ref: "Profile",
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
    default: "Pending", // Set the default value for status
  },
  houseId: {
    type: mongoose.Schema.Types.Mixed,
  },
  GrandTotal: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
  },
  cancellationReason: {
    type: String,
    default: null, // Default value is null, meaning not canceled by default
  },
  returnReason: {
    type: String,
    default: null, // Default value is null, meaning not canceled by default
  },
  zone: {
    type: String,
  },
  shippingagentid: {
    type: String,
    default: null,
  },
});
orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
