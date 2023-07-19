const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please select a product"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter product quantity"],
    },
    eachItemPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    itemDiscount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CartItemSchema.pre("save", async function () {
  console.log("was here");
});

module.exports = mongoose.model("CartItem", CartItemSchema);
