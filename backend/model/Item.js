import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

itemSchema.index({ customerId: 1, date: -1 });

export default mongoose.model("Item", itemSchema);
