const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
var multer = require('multer');
var fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
var cloudinary = require('cloudinary');
var ObjectID = require('mongodb').ObjectID;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + '/uploads/'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route    POST api/post
// @desc     Create or update a post
// @access   Private
router.post('/', auth, upload.single('photo'), async (req, res) => {
        console.log(auth);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        // console.log(req);
        let photo_path = path.join(__dirname + '/uploads/' + req.file.filename);
        await cloudinary.v2.uploader.upload(photo_path,
            async function (error, result) {
                console.log(result, error);
                if (result.secure_url) {
                    const postFields = {
                        user: req.user.id,
                        title: req.body.title,
                        text: req.body.text,
                        photo: result.secure_url
                    };
                    try {
                        let post = await Post.create(postFields);
                        res.status(201).json(post);
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error');
                    }
                } else {
                    res.status(500).send('Server Error');
                }
            });

    }
);
// @route    PUT api/pur/:post_id
// @desc     Update a specific post
// @access   Private
router.put('/', auth, async (req, res) => {
        console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let userID = req.user.id;
        console.log(userID);
        let postID = req.body.post_id;
        console.log(postID);
        try {
            const post = await Post.findOne({
                _id: postID
            });
            console.log('Post: ', post)
            if (post.user.equals(userID)) {
                let result = await Post.findOneAndUpdate({_id: ObjectID(postID)}, {$set:{
                    "title": req.body.title,
                    "text": req.body.text,
                }}, {new: true});
                console.log('87',result);
                res.status(200).send(result);
            } else {
                return res.status(400).json({msg: 'You do not have permission to update this post.'});
            }
        } catch (err) {
            console.error(err.message);
            if (err.kind == 'ObjectId') {
                return res.status(400).json({msg: 'Post not found'});
            }
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

        if (!post) return res.status(400).json({msg: 'No posts found'});

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'User not found'});
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

        if (!post) return res.status(400).json({msg: 'No posts found'});

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
