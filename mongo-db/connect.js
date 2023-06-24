const mongoose = require("mongoose");

let mongoose_connect = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(
      "mongodb+srv://gururaj:k11@cluster0.sbiekd1.mongodb.net/Orders?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    )
    .then((e) => {
      console.log("mongodbconnected");
    });
};

//exports
module.exports = { mongoose_connect };
