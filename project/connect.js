const mongoose = require('mongoose');

async function ConnectMongoDB(mongo_URL) {
  try {
    await mongoose.connect(mongo_URL, {useNewUrlParser: true}, { useUnifiedTopology: true });
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
}

module.exports = ConnectMongoDB;