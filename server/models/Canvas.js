const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const canvasSchema = new mongoose.Schema({
  sheet_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'private', // default for now
  },
  description: {
    type: String,
    default: '',
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_last_opened: {
    type: Date,
    default: Date.now,
  },
  collaborators: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['owner', 'editor', 'viewer'],
        default: 'viewer',
      },
    },
  ],
});

module.exports = mongoose.model('Canvas', canvasSchema);
