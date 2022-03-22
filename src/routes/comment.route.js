const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Post = require('../models/post.model');

const {
    ensureAuthenticated,
    inCourse,
    isOwner
} = require('../middleware/auth');
// Add Comment Route

//Add comment
router.post('/addComment/:id', [ensureAuthenticated, inCourse], async (req, res, next) => {
    
    let post1;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            post1 = await Post.findOne({
                _id: req.params.id
            });
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (post1) {
            const comment = new Comment({
                content: req.body.content,
                post: post1,
                createdAt: Date.now(),
                createdBy: req.user
            });
            post1.comments.push(comment);
            
            req.flash('success_msg', 'Post Comment Added Successfully.');
            res.redirect('/post/id=req.body._id');
        }
    }
});

//Edit Comment
router.put('/editComment/:id', [ensureAuthenticated, isOwner], async (req, res, next) => {
    
    let comment;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            comment = await Comment.updateOne({
                _id: req.params.id
            }, {

                $set: {
                   
                    content: req.body.content,
                    post: req.body.post,
                    createdAt: Date.now(),
                    createdBy: req.user,

            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       
         
        
        if (comment) {
            let post1;
            try {
              post1 = await Post.findById(comment.post);
            } catch (err) {
              const error = new HttpError('Editing comment failed, please try again', 500);
              return next(error);
            }
          
            if (!post1) {
              const error = new HttpError('Could not find post for provided id', 404);
              return next(error);
            }
            
            post1.comments.push(comment);
            
           /* $push: {
                   
                comments: [{
                    content: req.body.content,
                    createdAt: Date.now(),
                    createdBy: req.user
                  }],*/
            req.flash('success_msg', 'Post Comment Updated Successfully.');
            res.redirect('/post/id=post1._id');
        }
    }
});

//Delete Comment
router.delete('/removeComment/:id', [ensureAuthenticated, isOwner], async (req, res, next) => {
    
    let result;
    try {
        result = await Comment.remove({
            _id: req.params.id
        });
      } catch (err) {
        const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
      }
         
    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        let post1;
        try {
          post1 = await Post.findById(comment.post);
        } catch (err) {
          const error = new HttpError('Editing comment failed, please try again', 500);
          return next(error);
        }
      
        if (!post1) {
          const error = new HttpError('Could not find post for provided id', 404);
          return next(error);
        }
        
        post1.comments.pull(result);
        res.redirect('/post/id=post1._id');
    } 
    else {
        res.status(500).send();
    }
       
});
module.exports = router;