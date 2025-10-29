import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB only if MONGO_URI is provided
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
} else {
  console.warn("MONGO_URI not set. Running without a database connection.");
}

//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
