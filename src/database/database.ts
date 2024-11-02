import mongoose from "mongoose";

const dbURI = "mongodb://localhost:27017/landings";

mongoose.connect(dbURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;