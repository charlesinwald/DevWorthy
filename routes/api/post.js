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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        // console.log(req);
        let photo_path = path.join(__dirname + '/uploads/' + req.file.filename);
        let tags = []
        if (req.body.tags) {
            tags = req.body.tags;
        }
        await cloudinary.v2.uploader.upload(photo_path,
            async function (error, result) {
                if (result.secure_url) {
                    const postFields = {
                        user: req.user.id,
                        title: req.body.title,
                        text: req.body.text,
                        tags: tags,
                        photo: result.secure_url
                    };
                    try {
                        let post = await Post.create(postFields);
                        const user = await User.findById(post.user, 'firstName lastName');
                        let result = JSON.parse(JSON.stringify(post));
                        let names = {"firstName" : user.firstName, "lastName" : user.lastName};
                        let newpost = Object.assign(result, names);
                        console.log(newpost)
                        res.status(201).json(newpost);
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
// @route    PUT api/post/
// @desc     Update a specific post
// @access   Private
router.put('/', auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let userID = req.user.id;
        let postID = req.body.post_id;
        try {
            const post = await Post.findOne({
                _id: postID
            });
            // console.log('Post: ', post)
            if (post.user.equals(userID)) {
                let result = await Post.findOneAndUpdate({_id: ObjectID(postID)}, {
                    $set: {
                        "title": req.body.title,
                        "text": req.body.text,
                    }
                }, {new: true});
                // console.log('87', result);
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

// @route    POST api/post/vote
// @desc     Vote on a post, replies with change in score
// @access   Private
router.post('/vote', auth, async (req, res) => {
        //This will be used later to determine which voting list they will be added to
        var voterType = null;
        //Used for undoing downvote while upvoting simultaneously and vice versa
        var counterInc = 0;
        //Keeps track of the total change to the posts score
        var modification = 0;
        // console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req);
        console.log(req.body);
        let userID = req.user.id;
        console.log(userID);
        let postID = req.body.data.post_id;
        console.log(postID);
        let voteType = req.body.data.vote_type;
        try {
            //Vote Reversal
            if (voteType === "") {
                //Try reversing downvote
                await Post.updateOne({
                    _id: postID
                }, {
                    //$pull removes the element from the existing array
                    $pull: {
                        "downvoters": userID
                    }
                }, async (error, result) => {
                    console.log(result);
                    if (result.nModified > 0) {
                        //Votes goes up by one because we undid downvote
                        await Post.updateOne({_id: postID}, {
                            $inc: {
                                "votes": 1
                            }
                        });
                        modification += 1;
                    }
                    //Reversing upvote otherwise
                    else {
                        await Post.updateOne({_id: postID}, {
                            $pull: {
                                "upvoters": userID
                            }
                        }, async (error, result) => {
                            console.log(result);
                            if (result.nModified > 0) {
                                await Post.updateOne({_id: postID}, {
                                    $inc: {
                                        "votes": -1
                                    }
                                });
                                modification -= 1;
                            }
                        });
                    }
                });
            }
            //Upvoting
            if (voteType === "up") {
                voterType = "upvoters";
                await Post.updateOne({_id: postID}, {
                    $pull: {
                        "downvoters": userID
                    },
                }, (error, result) => {
                    console.log(result);
                    //If they were a downvoter before, we undo the downvote so we add 2
                    if (result.nModified > 0) {
                        counterInc = 2;
                    }
                    //Normal upvote
                    else {
                        counterInc = 1;
                    }
                });
            } else if (voteType === "down") {
                voterType = "downvoters";
                await Post.updateOne({_id: postID}, {
                    $pull: {
                        "upvoters": userID
                    },
                }, (error, result) => {
                    console.log(result);
                    //Undo upvote to downvote, so subtract 2
                    if (result.nModified > 0) {
                        counterInc = -2;
                    }
                    //Normal downvote
                    else {
                        counterInc = -1;
                    }
                });
            }
            if (voteType !== "") {
                await Post.updateOne({_id: postID}, {
                    $addToSet: {
                        [voterType]: userID
                    }
                }, async (error, result) => {
                    console.log(result);
                    if (result.nModified > 0) {
                        let vote = await Post.updateOne({_id: postID}, {
                            $inc: {
                                "votes": counterInc
                            }
                        });
                        modification += modification;
                        console.log(modification);
                        res.send(counterInc.toString());
                    }
                    console.log(modification);
                    res.send(counterInc.toString());
                });
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


// @route    DELETE api/post/:post_id
// @desc     Delete a specific post
// @access   Private
router.delete('/', auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let userID = req.user.id;
        let postID = req.body.post_id;
        try {
            const post = await Post.findOne({
                _id: postID
            });
            if (post.user.equals(userID)) {
                let result = await Post.deleteOne({_id: ObjectID(postID)});
                res.status(200).send(result);
            } else {
                return res.status(400).json({msg: 'You do not have permission to delete this post.'});
            }
        } catch (err) {
            console.log(err);
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
        //Query MongoDB for all posts in the Post collection
        let query = {}
        if (req.query.tag) {
            console.log(req.query.tag)
            query = {tags: req.query.tag};
        }
        //Pagination, with pages of 9 images at a time
        let skips = 0;
        if (req.query.page) {
            skips = 9 * (req.query.page - 1)
        }
        const posts = await Post.find(
            query
        ).skip(skips).limit(9);
        //If there are none, respond as such
        if (!posts) return res.status(400).json({msg: 'No posts found'});
        //Find the user's name
        let result = []
        for(var i in posts) {
            //We need a deep copy here <sigh>.... because Javascript doesn't want to give us the actual object
            //for us to work with, and turning it into a string and back does the trick
            let post = JSON.parse(JSON.stringify(posts[i]));
            const user = await User.findById(post.user, 'firstName lastName');
            let names = {"firstName" : user.firstName, "lastName" : user.lastName};
            let newpost = Object.assign(post, names);
            result.push(newpost);
        }
        res.json(result);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
