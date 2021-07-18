import { model, Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    postage_amount: {
      type: Number,
      default: 0.0,
    },
    postage_stamps: [{
      type: Schema.Types.ObjectId,
      ref: "Postage_stamp",
    }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Purchase = model("Purchase", purchaseSchema);

export default Purchase;
