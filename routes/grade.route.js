const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const {
    Student
} = require('../models/student.model');
const {
    Lecturer
} = require('../models/lecturer.model');
const {
    Course
} = require('../models/course.model');
const {
    Grade
} = require('../models/grade.model');
const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../middleware/auth');


const HttpError = require('../models/http-error.model');

//Get grade with id
router.get('/:gid', async (req, res, next) => {
    
    let grade;
    try{

        grade = await Grade.findById(gid)

    }catch (err) {
    const error = new HttpError(
      'Something went wrong.',
      500
    );
    return next(error);
  }
    

    if (grade)
        res.json({ grade: grade.toObject({ getters: true }) });
    else
    {
        const error = new HttpError(
            'Could not find a grade for the provided id.',
            404
          );
          return next(error);
    }
        
});

//Get student's course
router.get('/:studentId', async (req, res, next) => {
    let grade;
    try{
        grade = await Grade.find({
            student: req.params.studentId
        }).select({
            student: 1,
            course: 1,
            grade: 1
        });

    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a student.',
      500
    );
    return next(error);
  }
    

    if (grade)
        res.json({ grade: grade.toObject({ getters: true }) });
    else
    {
        const error = new HttpError(
            'Could not find a course for the provided student.',
            404
          );
          return next(error);
    }
        
});

//Get students of specific course
router.get('/:cid', async (req, res, next) => {
    let grade;
    try{
        grade = await Grade.find({
            course: req.params.cid
        }).select({
            student: 1,
            course: 1,
            grade: 1
        });

    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a course.',
      500
    );
    return next(error);
  }
    

    if (grade)
        res.json({ grade: grade.toObject({ getters: true }) });
    else
    {
        const error = new HttpError(
            'Could not find students for the provided course.',
            404
          );
          return next(error);
    }
        
});

//Get courses of specific lecturer
router.get('/:lid', async (req, res, next) => {
    let grade;
    try{
        grade = await Grade.find({
            lecturer: req.params.lid
        }).select({
            lecturer: 1,
            course: 1
        });

    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a course.',
      500
    );
    return next(error);
  }
    

    if (grade)
    res.json({ grade: grade.toObject({ getters: true }) });
    else
    {
        const error = new HttpError(
            'Could not find courses for the provided lecturer.',
            404
          );
          return next(error);
    }
        
});

router.get('/:cid&:sid',  async (req, res, next) => {

    let grade;
    try{
        grade = await Grade.find({
            student: req.params.sid,
            course: req.params.cid
        })

    }catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a student or course.',
      500
    );
    return next(error);
  }
    

    if (grade)
        res.json({ grade: grade.toObject({ getters: true }) });
    else
    {
        const error = new HttpError(
            'Could not find a course for the provided student in this course.',
            404
          );
          return next(error);
    }
    
});

router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {
    let course;
    let student;
    let lecturer
    try {
        course = await Course.find();
        student = await Student.find();
        lecturer = await Lecturer.find();
      } catch (err) {
        const error = new HttpError(
          'Course or Student or Lecturer Department is empty .',
          500
        );
        return next(error);
      }
    if (course && student && lecturer) {
        res.json({ course: course.toObject({ getters: true }),
        student: student.toObject({ getters: true }),
        lecturer: lecturer.toObject({ getters: true })    
    });
    }
});

router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    else {
       
        const grade = new Grade({
            student: req.body.student,
            lecturer: req.body.lecturer,
            course: req.body.course,
            grade: req.body.grade,
            courseType: req.body.courseType,
            repeat: req.body.repeat,
            termYear: req.body.termYear,
            termName: req.body.termName
        });

        try {
            const result = await grade.save();

            if (result) {
                req.flash('success_msg', 'Grade saved successfully.');
                let gid = grade._id
                res.redirect('/grades/:gid');
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

router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let course;
    let student;
    let lecturer;
    let grade;
    try {
        course = await Course.find();
        student = await Student.find();
        lecturer = await Lecturer.find();
        grade = await Grade.findOne({
            _id: req.params.id
        });
      } catch (err) {
        const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
      }

    
      if (grade && course && student && lecturer) {
        res.json({
        grade: grade.toObject({ getters: true }),
        course: course.toObject({ getters: true }),
        student: student.toObject({ getters: true }),
        lecturer: lecturer.toObject({ getters: true })    
    });
    }
});

router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res, next) => {
    let grade;
    try {
        grade = await Grade.update({
            _id: req.params.id
        }, {
            $set: {
            student: req.body.student,
            lecturer: req.body.lecturer,
            course: req.body.course,
            grade: req.body.grade,
            courseType: req.body.courseType,
            repeat: req.body.repeat,
            termYear: req.body.termYear,
            termName: req.body.termName
            }
        });
    
    
      } catch (err) {
        const error = new HttpError(
          'Something went wrong.',
          500
        );
        return next(error);
      }
    
    if (grade) {
        req.flash('success_msg', 'Grade saved successfully.');
        let gid = grade._id
        res.redirect('/grades/:gid');
    } 
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res, next) => {
    let result;
    try {
        result = await Grade.remove({
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
    }
});

module.exports = router;