const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["painting", "sculpture", "photography", "digital", "mixed-media", "other"],
    },
    medium: {
      type: String,
      required: true,
    },
    dimensions: {
      height: { type: Number },
      width: { type: Number },
      depth: { type: Number, default: 0 },
      unit: { type: String, default: "cm" },
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    available: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    creationDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for imageUrl - returns first image from images array
ArtworkSchema.virtual("imageUrl").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

const Artwork = mongoose.model("Artwork", ArtworkSchema);
module.exports = Artwork;
