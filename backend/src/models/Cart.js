const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  artwork: {
    type: Schema.Types.ObjectId,
    ref: "Artwork",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  priceAtAdd: {
    type: Number,
    required: true,
  },
});

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total cart value
CartSchema.virtual("total").get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0
  );
});

// Virtual for item count
CartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
