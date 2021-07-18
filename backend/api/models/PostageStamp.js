import { model, Schema } from "mongoose";

const stampSchema = new Schema(
  {
    amount: {
      type: Number,
      default: 0.00
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    stamp_name: {
      type: String,
    },
    description: {
      type: String,
    },
    purchase: {
      type: Schema.Types.ObjectId,
      ref: 'Purchase'
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Stamp = model("Postage_stamp", stampSchema);

export default Stamp;
