var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//get posts
router.get('/posts', function(req, res, next){
    Post.find(function(err, posts){
        if(err){
            console.log(err);
            return next(err);
        }
        res.json(posts);
    });
});

//save posts
router.post('/posts', function(req, res, next){
    var post = new Post(req.body);

    post.save(function(err, post){
        if(err){return next(err); }

        res.json(post);
    });
});

//route for pre-loading posts
router.param('post', function(req, res, next, id){
    var query = Post.findById(id);

    query.exec(function (err, post){
        if(err) {
            console.log(err);
            return next(err);
        }
        if(!post) {
            return next(new Error('can\'t find post'));
        }

        req.post = post;
        return next();
    });
});

// return a single post
router.get('/posts/:post', function(req, res, next){
    req.post.populate('comments', function(err, post){
        if(err){return next(err);}

        res.json(req.post);
    });
});

// upvote post
router.put('/posts/:post/upvote', function(req, res, next){
    req.post.upvote(function(err, post){
        if(err) {return next(err);}

        res.json(post);
    });
});

// comments route for a specific post
router.post('/posts/:post/comments', function(req, res, next){
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){
        if(err){return next(err);}

        req.post.comments.push(comment);
        req.post.save(function(err, post){
            if(err){return next(err);}

            res.json(comment);
        });
    });
});

// upvotes for comments
router.put('/posts/:comment/upvote', function(req, res, next){
    req.comment.upvote(function(err, comment){
        if(err) {return next(err);}

        res.json(comment);
    });
});

//route for pre-loading comments
router.param('comment', function(req, res, next, id){
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if(err) {return next(err);}
        if(!comment) {
            return next(new Error('can\'t find post'));
        }

        req.comment = comment;
        return next();
    });
});

// endpoint for authentication, returns JWT token
router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function(err){
        if(err){return next(err);}

        return res.json({token: user.generateJWT()});
    });
})

module.exports = router;