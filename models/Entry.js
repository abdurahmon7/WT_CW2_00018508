const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  title: String,
  location: String,
  photoUrl: String,
  description: String,
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

module.exports = mongoose.model('Entry', entrySchema);
