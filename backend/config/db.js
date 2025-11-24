const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ndr_web";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("\n✅ MongoDB Connected Successfully\n");
  } catch (err) {
    console.error("\n❌ MongoDB Connection Failed:");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
