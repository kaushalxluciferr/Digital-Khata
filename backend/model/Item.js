import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
});

itemSchema.index({ customerId: 1, date: -1 });

export default mongoose.model("Item", itemSchema);
