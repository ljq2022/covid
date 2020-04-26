const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  assigner: { type: String, required: true},
  username: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  file: { type: String, required: true },
  complete: { type: Boolean, required: true},
  positive: { type: Boolean},
  data: { type: String, required: true},
  height: { type: Number },
  width: { type: Number }
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
