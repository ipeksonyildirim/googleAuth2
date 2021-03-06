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

// Get Post Route
router.get('/id=:id',  async (req, res, next) => {

    let post;
    try{
        post = await Post.find({
            id: req.params._id
        })

    }catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find a post.',
        500
    );
    return next(error);
    }

    if (post)
        res.json({ post: post });
    else
    {
    const error = new HttpError(
        'Could not find a post for the provided id.',
        404
        );
        return next(error);
    }
});

// Course's Posts Route
router.get('/code=:code',  async (req, res, next) => {
    let course1;
    try {
        course1 = await Course.findOne({
            code: req.params.code
        });
      } catch (err) {
        const error = new HttpError(
          'Fetching course failed, please try again later.',
          500
        );
        return next(error);
      }

    if (course1) {
        let post;
        try{
            post = await Post.find({
                course: course1
            })
    
        }catch (err) {
        const error = new HttpError(
          'Something went wrong, could not find a post.',
          500
        );
        return next(error);
      }

        if (post)
        res.json({ post: post });
        else
        {
            const error = new HttpError(
                'Could not find a post for the provided id.',
                404
              );
              return next(error);
        }
    }
    else{
        //req.flash('error_msg', 'Record not found.');
        res.status(500).json({error: "Internal server error"})
    }
});

// Post get Title Route
router.get('/pid=:pid', async (req, res, next) => {
    let post;
    try {
        post = await Post.findOne({
            _id: req.params.pid
        });
      } catch (err) {
        const error = new HttpError(
          'Fetching post failed, please try again later.',
          500
        );
        return next(error);
      }

    if (post) {
        res.json({ post: post });
    }
    else{
      res.status(500).json({error: "Internal server error"})
    }
});
// Post get Title Route
router.get('/title=:title', async (req, res, next) => {
  let post;
  try {
      post = await Post.findOne({
          title: req.params.title
      });
    } catch (err) {
      const error = new HttpError(
        'Fetching post failed, please try again later.',
        500
      );
      return next(error);
    }

  if (post) {
      res.json({ post: post });
  }
  else{
     res.status(500).json({error: "Internal server error"})
  }
});
// Add Post 
router.get('/add', async (req, res, next) => {
    let course;
  try {
      course = await Course.find();
    } catch (err) {
      const error = new HttpError(
        'Course is empty .',
        500
      );
      return next(error);
    }
  if (course.length > 0) {
    res.json({ course: course});
  }
});

// Add Post
router.post('/add', async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
        const post = new Post({
           
            title: req.body.title,
            content: req.body.content,
            course: req.body.course,
            createdAt: Date.now(),
            createdBy: req.body.createdBy,
          
            
        });

        let result;
        try {
            result = await Post.findOne({
                'title': req.body.title
            });
            
        } catch (err) {
            const error = new HttpError(
              'Something went wrong',
              500
            );
            return next(error);
          }
       

        if (!result) {
            try {
              console.log(post);
                result = await post.save();

                if (result) {
                  res.status(200).json({status:"ok"})
                } else {
                  //req.flash('error_msg', 'Record not found.');
                  res.status(500).json({error: "Internal server error"})
                }
            } catch (ex) {
                const error = new HttpError(
                    'Something went wrong.',
                    500
                  );
                  return next(error);
            }
        } else {
                const error = new HttpError(
                    'Post Already Exists.',
                    500
                  );
                  return next(error);
        }
    }
});

// Add Post with course id
router.post('/add/cid=:cid', async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
    let course;
  try {
      course = await Course.findOne({_id: req.params.cid});
    } catch (err) {
      const error = new HttpError(
        'Course is empty .',
        500
      );
      return next(error);
    }
        const post = new Post({
           
            title: req.body.title,
            content: req.body.content,
            course: course,
            createdAt: Date.now(),
            createdBy: req.body.createdBy,
          
            
        });

        let result;
        try {
            result = await Post.findOne({
                'title': req.body.title
            });
            
        } catch (err) {
            const error = new HttpError(
              'Something went wrong',
              500
            );
            return next(error);
          }
       

        if (!result) {
          let course1 ,result1;
            try {
              result1 = await post.save();

                if (result1) {
                  course1 =  await Course.updateOne(
                    {_id: req.params.cid} ,
                    {$push: { posts: post } ,
                  });

                    //req.flash('success_msg', 'Information saved successfully.');
                    res.status(200).json({status:"ok"})
                } else {
                    //req.flash('error_msg', 'Record not found.');
                     res.status(500).json({error: "Internal server error"})
                }
            } catch (ex) {
                const error = new HttpError(
                    'Something went wrong.',
                    500
                  );
                  return next(error);
            }
        } else {
                const error = new HttpError(
                    'Post Already Exists.',
                    500
                  );
                  return next(error);
        }
    }
});

// Post Edit Form
router.get('/edit/:id', async (req, res, next) => {
    let post;
    let course;
    try {
        course = await Course.find();
        post = await Post.findOne({
            _id: req.params.id
        });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong.',
            500
          );
          return next(error);
    }
    res.json({ course: course });
  
});

// Post Update Route
router.put('/edit/:id',  async (req, res, next) => {
    let post;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            post = await Post.updateOne({
                _id: req.params.id
            }, {
                $set: {
            content: req.body.content,
            createdAt: Date.now(),
            }});
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
       

        if (post) {
          //req.flash('success_msg', 'Post Details Updated Successfully.');
          res.status(200).json({status:"ok"})
        } else {
          //req.flash('error_msg', 'Record not found.');
          res.status(500).json({error: "Internal server error"})
        }
    }
});

//Post is removed by its owner
router.delete('/:id',  async (req, res, next) => {
    let result;
    try {
        result = await Post.remove({
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
        //req.flash('success_msg', 'Record deleted successfully.');
        res.status(200).json({status:"ok"})
      } else {
        //req.flash('error_msg', 'Record not found.');
        res.status(500).json({error: "Internal server error"})
    }
});





module.exports = router;