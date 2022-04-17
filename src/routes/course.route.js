const express = require('express');
const router = express.Router();
const moment = require('moment');
const { validationResult } = require('express-validator');

const Department = require('../models/department.model');
const Course = require('../models/course.model');
const Student = require('../models/student.model');
const Post = require('../models/post.model');
const Assignment = require('../models/assignment.model');
const Resource = require('../models/resource.model');
const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');
const HttpError = require('../models/http-error.model');

// Course Home Route
router.get('/', async (req, res, next) => {
  let course;
  try {
      course = await Course.find();
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course.length>0) {
      let pages;
      try {
          pages = await Course.find().countDocuments();

      }  catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500
          );
          return next(error);
        }

      res.json({ 
        course: course,
        pages: pages
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

// Course Home Route
router.get('/code=:code', async (req, res, next) => {

  let course;
  try {
      course = await Course.find({
        code: req.params.code
      });
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course.length>0) {
     

      res.json({ 
        course: course,
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

// Course Home Route
router.get('/id=:id', async (req, res, next) => {

  let course;
  try {
      course = await Course.findOne({
        _id: req.params.id
      });
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course) {
     

      res.json({ 
        course: course,
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

// Add Course Form Route
router.get('/add', async (req, res, next) => {
  let dept;
  try {
      dept = await Department.find();
    } catch (err) {
      const error = new HttpError(
        'User, Department is empty .',
        500
      );
      return next(error);
    }
  if (dept.length > 0) {
    res.json({ dept: dept});
  }
});

// Process Student Form Data And Insert Into Database.
router.post('/add', async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  else {
     
      const course = new Course({
          code: req.body.code,
          name: req.body.name,
          credit: req.body.credit,
          department: req.body.department,
          terms: req.body.terms,
          schedule: {
              day: req.body.day,
              time: req.body.time,
              location: req.body.location,
              zoomId: req.body.zoomId
          },
          assignments: {
            assignment: req.body.assignment,
        },
        students: req.body.students,
        lecturer: req.body.lecturer,
      });

      try {
          const result =  course.save();

          if (result) {
              res.redirect('/course');
          }
      } catch (ex) {
          const error = new HttpError(
              'Something went wrong.',
              500
            );
            return next(error);
      }
  }
});

// Course Edit Form
router.get('/edit/:id', async (req, res, next) => {
  let dept;
  let course;
  try {
      dept = await Department.find();
      course = await Course.findOne({
          _id: req.params.id
      });
  
    } catch (err) {
      const error = new HttpError(
        'Something went wrong.',
        500
      );
      return next(error);
    }
  
  if (course && dept.length>0) {
    res.json({ 
      dept: dept,
      course: course,
  });
  }
});

// Course Update Route
router.put('/edit/:id', async (req, res, next) => {
  let course;
  try {
      course = await Course.update({
          _id: req.params.id
      }, {
          $set: {
            code: req.body.code,
            name: req.body.name,
            credit: req.body.credit,
            department: req.body.department,
            terms: req.body.terms,
            schedule: {
                day: req.body.day,
                time: req.body.time,
                location: req.body.location,
                zoomId: req.body.zoomId
            },
            assignments: {
              assignment: req.body.assignment,
          },
          students: req.body.students,
          lecturer: req.body.lecturer,
          }
      });
  
  
    } catch (err) {
      const error = new HttpError(
        'Something went wrong.',
        500
      );
      return next(error);
    }
  
  if (course) {
      //req.flash('success_msg', 'Course Updated Successfully.');
      res.redirect('/course');
  } 
});

// Course Search by dept id's Route
router.get('/dept=:dept', async (req, res, next) => {
    let course;
    try{
        course = await Course.find({
            department: req.params.dept
        }).select({
            code: 1,
            name: 1,
            _id: 1,
        });

    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a department.',
      500
    );
    return next(error);
  }
    

    if (course.length>0)
    res.json({ course: course });
    else
    {
        const error = new HttpError(
            'Could not find a course for the provided id.',
            404
          );
          return next(error);
    }
        
});

// Course Delete Route
router.delete('/:id', async (req, res, next) => {
    let result;
    try {
        result = await Course.remove({
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
        res.redirect('/course');
    }
});

// Course Info Route
router.get('/getCourseInfo/id=:id', async (req, res, next) => {

  let course;
  try {
      course = await Course.findOne({
        _id: req.params.id
      });
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course) {
     let pages = 0;
     let avgGpa = 0.0;
     let student;
     console.log(course.students)
     for(const students of course.students){
       pages++;
        try {
          student = await Student.findOne({
            _id: students,
          })
        } catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a department.',
            500,
          );
          return next(error);
        }
        if(student){
          avgGpa = avgGpa + student.gpa
        }
        
        
     }
     avgGpa = avgGpa/pages;

      res.json({ 
        students: pages,
        avgGpa: avgGpa

      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

// Course Appointment Route
router.get('/getPosts/id=:id', async (req, res, next) => {

  let course;
  try {
      course = await Course.findOne({
        _id: req.params.id
      });
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course) {
     let posts = [];
     for(const post of course.posts){
      let stuPosts = await Post.findOne({_id : post._id})
      posts.push(stuPosts);
     }
      res.json({ 
        courseCode: course.code,
        courseName: course.name,
        posts: posts,

      });
      
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

// Course Assignment Route
router.get('/getAssignments/id=:id', async (req, res, next) => {

  let course;
  let assignments;
  try {
      course = await Course.findOne({
        _id: req.params.id
      });
      assignments = await Assignment.find({
        course: course._id
      })
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course) {
     let courseAssignments = [];

     for(const assignment of assignments){
      console.log(assignment._id)

      let stuAssignment = await Assignment.findOne({_id : assignment._id})
      courseAssignments.push(stuAssignment);
     }
      res.json({ 
        courseCode: course.code,
        courseName: course.name,
        assignments: courseAssignments,

      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

// Course Blog Route
router.get('/getBlog/id=:id', async (req, res, next) => {

  let course;
  let assignments;
  let lectureVideos;
  let lectureNotes;
  let exams;
  let otherResources;
  
  try {
      course = await Course.findOne({
        _id: req.params.id
      });
      assignments = await Assignment.find({
        course: course._id
      })
      lectureVideos = await Resource.find({
        course: course._id,
        isLectureVideos: true
        
      })
      lectureNotes = await Resource.find({
        course: course._id,
        isLectureNotes: true
        
      })
      exams = await Resource.find({
        course: course._id,
        isExam: true
        
      })
      otherResources = await Resource.find({
        course: course._id,
        isOtherResources: true
        
      })
  }  catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a course.',
        500
      );
      return next(error);
    }

  if (course) {
     let courseAssignments = [];
     let courseLectureVideos = [];
     let courseLectureNotes = [];
     let courseExams = [];
     let courseOtherResources = [];
    
     for(const assignment of assignments){
      console.log(assignment._id)

      let stuAssignment = await Assignment.findOne({_id : assignment._id})
      courseAssignments.push(stuAssignment);

     }
     for(const resource of lectureVideos){
      console.log(resource._id)

      let lectureVideo = await Resource.findOne({_id : resource._id})
      courseLectureVideos.push(lectureVideo);

     }
     for(const resource of lectureNotes){
      console.log(resource._id)

      let lectureNote = await Resource.findOne({_id : resource._id})
      courseLectureNotes.push(lectureNote);

     }
     for(const resource of exams){
      console.log(resource._id)

      let exam = await Resource.findOne({_id : resource._id})
      courseExams.push(exam);

     }
     for(const resource of otherResources){
      console.log(resource._id)

      let otherResource = await Resource.findOne({_id : resource._id})
      courseOtherResources.push(otherResource);

     }
     let posts = [];
     for(const post of course.posts){
      let stuPosts = await Post.findOne({_id : post._id}).populate('createdBy', 'name _id').populate({
        path: 'comments',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: {
          path: 'createdBy',
          model: 'User',
          select: 'name _id'
        } ,
     
      })
      
      posts.push(stuPosts);
     }
      res.json({ 
        courseCode: course.code,
        courseName: course.name,
        posts: posts,
        resources:{
          assignments:  courseAssignments,
          lectureVideos: courseLectureVideos,
          lectureNotes: courseLectureNotes,
          exams: courseExams,
          otherResources: courseOtherResources
        }
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a department.',
          500
        );
        return next(error);
  }
});

module.exports = router;