import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["CATERING", "DECORATION", "PHOTOGRAPHY", "MUSIC", "LIGHTING"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Vendor", vendorSchema);
