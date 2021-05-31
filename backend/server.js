const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter.js");
const productRouter = require("./routers/productRouter.js");
const dotenv = require("dotenv");
const orderRouter = require("./routers/orderRouter.js");
const path = require("path");
const uploadRouter = require("./routers/uploadRouter.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.use("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLINT_ID || "sb");
});

const dirname = path.resolve();
app.use("/uploads", express.static(path.join(dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
