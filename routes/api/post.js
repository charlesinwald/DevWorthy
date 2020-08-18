const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route    POST api/post
// @desc     Create or update a post
// @access   Private
router.post('/', auth,  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const postFields = {
      user: req.user.id,
      title: req.body.title,
      text: req.body.text
    };
    try {
      let post = await Post.create(postFields);
      res.status(201).json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/post/user/:user_id
// @desc     Get all posts by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const post = await Post.find({
      user: req.params.user_id
    });

    if (!post) return res.status(400).json({ msg: 'No posts found' });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    GET api/post/
// @desc     Get all posts
// @access   Public
router.get('/', async (req, res) => {
    try {
        const post = await Post.find({});

        if (!post) return res.status(400).json({ msg: 'No posts found' });

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
