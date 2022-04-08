const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error.model');
const Post = require('../models/post.model');
const {
    ensureAuthenticated,
    inCourse,
    isOwner
} = require('../middleware/auth');
// Add Comment Route

//Add comment
router.post('/addComment/:id',async (req, res, next) => {
    
    let post1;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
          
          var comment ={
            id: req.body.id,
            content: req.body.content,
            createdAt: Date.now(),
            createdBy: req.body.createdBy // req.user olack
        };
            post1 =  await Post.updateOne(
               {_id: req.params.id} ,
                { $push: { comments: comment } ,
            });
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       
        if (post1) {
          res.redirect('/post/id='+req.body._id);

        }
    }
});

//Edit Comment
router.put('/editComment/pid=:pid/id=:id', async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  else {
      let post1;
      try {
        post1 =  await Post.updateOne({ _id:req.params.pid,"comments.id": req.params.id}, {'$set': {
          'comments.$.content': req.body.content,
          'comments.$.createdAt': Date.now(),
      }});
      } catch (err) {
        const error = new HttpError('Could not find post for provided id', 404);
        return next(error);
      }

      if (post1) {
        
        res.redirect('/post/id=post1._id');

          }

      }
});

//Delete Comment
router.delete('/removeComment/pid=:pid/id=:id',async (req, res, next) => {
    
    let post1;
    try {
      post1 =  await Post.updateOne({ _id:req.params.pid}, {
        $pull: {
            comments: { id : req.params.id }
        }
    },
    { safe: true });
      } catch (err) {
        const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
      }
         
    if (post1) {
        res.redirect('/post/id=post1._id');
    } 
    else {
        res.status(500).send();
    }
       
});
module.exports = router;