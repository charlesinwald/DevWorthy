const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    default: 'untitled'
  },
  text: {
    type: String,
    default: ''
  },
  photo:
      {
        type: String,
        default: ''
      },
  date: {
    type: Date,
    default: Date.now
  },
  tags: [{type: String, default: ['General']}],
  upvoters: [{type: String}],
  downvoters: [{type: String}],
  votes: {
    type: Number,
    default: 0
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
