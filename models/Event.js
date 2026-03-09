import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        venue: {
            type: String,
            required: true
        },

        guests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        vendors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vendor"
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);