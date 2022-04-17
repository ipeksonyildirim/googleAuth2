const express = require('express')
const router = express.Router()

const {upload} = require('../helpers/filehelper');

const { validationResult } = require('express-validator');

const Assignment = require('../models/assignment.model');
const StudentAssignment = require('../models/studentAssignment.model');

const Course = require('../models/course.model');
const Student = require('../models/student.model');
const HttpError = require('../models/http-error.model');

//Upload assignment route
router.post("/upload/cid=:cid",upload.single('file'),  async (req, res, next) => {

    let course1;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            course1 = await Course.findOne({
                _id: req.params.cid
            });
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(!course1){
            const error = new HttpError(
                'Something went wrong, course is not found .',
                500
              );
              return next(error);
          }

          try{
            console.log(req.file)
            console.log(req.body.dueDate)
            const file = new Assignment({
                course: course1,
                title: req.body.title,
                description: req.body.description,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00,
                dueDate: req.body.dueDate,
                uploadedDate: Date.now(),
                isExam: false
            });
            await file.save();
            console.log(file)
            course1 =  await Course.updateOne(
              {_id: req.params.cid} ,
              {$push: { assignments: file } ,
            });
            
          }catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(course1){
            res.status(200).json({status:"ok"})
      } else {
        //req.flash('error_msg', 'Record not found.');
        res.status(500).json({error: "Internal server error"})
          }        
        }
});

//Upload homework route for student
router.get("/upload/cid=:cid/aid=:aid/sid=:sid/",upload.single('file'),  async (req, res, next) => {

  let assignment1;
  let student1;
  let course1;
  try {
  assignment1 = await StudentAssignment.findOne({
    course: req.params.cid,
    student: req.params.sid,
    assignment: req.params.aid,

});

  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500
    );
    return next(error);
  }
  if(!assignment1){
    res.json({ 
      isRegistered: false
      });  
  }

  try{

    student1 =  await Student.findOne({
      assignments: assignment1._id
    })
    console.log(assignment1)
    if(student1){
      res.json({ 
        isRegistered: true
       });
    }else {
      res.json({ 
        isRegistered: false
        });  
    }
  }catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500
    );
    return next(error);
  }
});

//Upload homework route for student
router.post("/upload/cid=:cid/aid=:aid/sid=:sid/",upload.single('file'),  async (req, res, next) => {

    let assignment1;
    let student1;
    let course1;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
          new HttpError('Invalid inputs passed, please check your data.', 422)
        );
      }
      else {
        try {
            course1 = await Course.findOne({
                _id: req.params.cid
            });
            student1 = await Student.findOne({
              _id: req.params.sid
          });
          assignment1 = await Assignment.findOne({
            _id: req.params.aid
        });
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(!(course1 && assignment1 && student1)){
            const error = new HttpError(
                'Something went wrong, course is not found .',
                500
              );
              return next(error);
          }

          var dateObj = new Date();
          let isLate = false;
          if(Date.now() > assignment1.dueDate){
            isLate= true;
          }



          try{

            const file = new StudentAssignment({
                course: course1,
                student: student1,
                assignment: assignment1,
                title: req.body.title,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00,
                uploadedDate: Date.now(),
                lateSubmission: isLate,
                isExam: false
            });
            console.log(file)
            await file.save();
            student1 =  await Student.updateOne(
              {_id: req.params.sid} ,
              {$push: { assignments: file } ,
            });
            console.log(student1.assignments)

            res.status(201).send('File Uploaded Successfully');

          }catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
        
        }
});

router.get("/getList/aid=:aid", async (req, res, next) => {
    let assignment1;
    try {
        assignment1 = await Assignment.findOne({
            _id: req.params.aid
        });
      } catch (err) {
        const error = new HttpError(
          'Something went wrong .',
          500
        );
        return next(error);
      }

      if (assignment1) {
      
        res.json({ 
         assignment: assignment1
        });
    } else {
        const error = new HttpError(
            'Something went wrong, could not find a assignment.',
            500
          );
        }    

});

router.get("/getList/cid=:cid", async (req, res, next) => {
  let course1;
  try {
    course1 = await Course.findOne({
          _id: req.params.cid,
          isExam: false
      });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong .',
        500
      );
      return next(error);
    }

    if (course1) {
      let assignments;
      let assignmentArr = [];
      for(const assignment of course1.assignments){
        try {
          assignments = await Assignment.findOne({
            _id: assignment,
          })} catch (err) {
            const error = new HttpError(
              'Something went wrong, could not find a course.',
              500,
            );
            return next(error);
          }
          console.log(assignments)
          assignmentArr.push(assignments);
        }
    
      res.json({ 
       assignment: assignmentArr
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a assignment.',
          500
        );
      }    

});

router.get("/getStudentAssignment/aid=:aid", async (req, res, next) => {
  let assignment1;
  try {
      assignment1 = await StudentAssignment.findOne({
          _id: req.params.aid
      });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong .',
        500
      );
      return next(error);
    }

    if (assignment1) {
    
      res.json({ 
       assignment: assignment1
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a assignment.',
          500
        );
      }    

});

router.get("/getStudentAssignment/sid=:sid", async (req, res, next) => {
let student1;
try {
  student1 = await Student.findOne({
        _id: req.params.sid,
        isExam: false
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500
    );
    return next(error);
  }

  if (student1) {
    let assignments;
    let assignmentArr = [];
    for(const assignment of student1.assignments){
      try {
        assignments = await StudentAssignment.findOne({
          _id: assignment,
        })} catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500,
          );
          return next(error);
        }
        console.log(assignments)
        assignmentArr.push(assignments);
      }
  
    res.json({ 
     assignment: assignmentArr
    });
} else {
    const error = new HttpError(
        'Something went wrong, could not find a assignment.',
        500
      );
    }    

});

const fileSizeFormatter = (bytes, decimal) => {
  if(bytes === 0){
      return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}

module.exports = router;
