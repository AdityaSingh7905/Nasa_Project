const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://adityasingh:ChH0PlgeQrQFLSHT@cluster0.cau3dnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connection.once("open", () => {
  console.log("MongoDb connection has been created!!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
