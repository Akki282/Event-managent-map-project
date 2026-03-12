import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    otp: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
