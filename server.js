// server.js

const express = require("express");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const http = require("http");
const create = require("./route/create");
const Order = require("./mongo-db/ordershema");
const ordersget = require("./route/get");
const cancel = require("./route/cancel");
const returnorder = require("./route/return");
const agent = require("./route/Agentorder");

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  path: "/socket.io/", // Change this to your desired custom path
});

app.use(express.json());

// Connect to MongoDB
// mongoose.connect("mongodb://localhost/ecommerce", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
const { mongoose_connect } = require("./mongo-db/connect");
mongoose_connect();
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/order/create", create);
// Socket.IO event handler for order updates
io.on("connection", (socket) => {
  console.log("New client connected");
  const { profileId } = socket.handshake.query;
  console.log("Profile ID:", profileId); // Replace with the actual profile ID
  socket.join(profileId);
  const changeStream = Order.watch();

  // Send order updates to the connected client
  changeStream.on("change", async (change) => {
    if (change.operationType === "update") {
      const orderId = change.documentKey._id;
      const updatedOrder = await Order.findById(orderId);
      console.log(updatedOrder.userId);

      io.to(updatedOrder.userId).emit("orderUpdate", updatedOrder);
      socket.emit("hi");
    } else if (change.operationType === "insert") {
      const profileId = change.fullDocument.userId;
      console.log(profileId);
      io.to(profileId).emit("newOrder", change.fullDocument);
      console.log(`inserted${change.fullDocument}`);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    changeStream.close(); // Close the change stream on disconnect
  });
});
// app.get("/", (req, res) => {
//   res.send("balnk");
// });
// app.get("/order", (req, res) => {
//   res.send(" not  balnk");
// });

// API endpoint to create a new order

app.post("/orders", async (req, res) => {
  try {
    const { customerName, products } = req.body;

    // Calculate the total price based on products
    const total = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    // Create a new order
    const newOrder = await Order.create({
      customerName,
      products,
      total,
      status: "Pending",
    });

    // Emit a new order event to connected clients

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
app.use("/order/get", ordersget);
app.use("/order/cancel", cancel);
app.use("/order/return", returnorder);
app.use("/agent", agent);

// Start the server
const PORT = process.env.PORT || 3022;
app.get("/", (req, res) => {
  res.send("hi");
});
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
