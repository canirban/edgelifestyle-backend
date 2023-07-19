require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
// const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.SERVER_PORT || 5000;

const connectDb = require("./databaseUtil/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const cartRoute = require("./routes/cartRoutes");
app.use(morgan("tiny"));
app.use(express.json());
// app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/carts", cartRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
