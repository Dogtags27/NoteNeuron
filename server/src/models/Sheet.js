import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    data: {
      type: Object, // can hold shapes, positions, etc.
      default: { elements: [] },
    },
    sharedWith: [
      {
        type: String, // emails
      },
    ],
  },
  { timestamps: true }
);

const Sheet = mongoose.model('Sheet', sheetSchema);

export default Sheet;
