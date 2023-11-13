const mongoose = require("mongoose");

let mongoose_connect = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(
      "mongodb+srv://vvce21cseaiml0004:Ramguru123@gb.dq3vt5r.mongodb.net/Orders?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    )
    .then((e) => {
      console.log("mongodbconnected");
    });
};

//exports
module.exports = { mongoose_connect };
