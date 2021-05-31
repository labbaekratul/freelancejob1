const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");
// const { isAdmin, isAuth } = require ("../utils.js");

const orderRouter = express.Router();

orderRouter.get(
  "/",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "name");
    res.send(orders);
  })
);

orderRouter.get(
  "/mine",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user });
    res.send(orders);
  })
);

orderRouter.post(
  "/",

  // isAuth,

  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        // user: req.user._id,
      });

      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);

orderRouter.get(
  "/:id",
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

orderRouter.delete(
  "/:id",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: "Order Deleted", order: deleteOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

module.exports = orderRouter;
