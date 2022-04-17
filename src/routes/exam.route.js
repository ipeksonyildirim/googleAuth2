const express = require('express')
const router = express.Router()

const {upload} = require('../helpers/filehelper');

const { validationResult } = require('express-validator');

const Assignment = require('../models/assignment.model');
const StudentAssignment = require('../models/studentAssignment.model');

const Course = require('../models/course.model');
const Student = require('../models/student.model');
const HttpError = require('../models/http-error.model');

//Upload exam route
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
                isExam: true
            });
            await file.save();
            console.log(file)
            course1 =  await Course.updateOne(
              {_id: req.params.cid} ,
              {$push: { exams: file } ,
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

//Upload exams route for student
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
          console.log(assignment1.dueDate)
          console.log(dateObj.getUTCDate())
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
                isExam: true
            });
            console.log(file)
            await file.save();
            student1 =  await Student.updateOne(
              {_id: req.params.sid} ,
              {$push: { exams: file } ,
            });
            console.log(student1.exams)

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
    let exam1;
    try {
        exam1 = await Assignment.findOne({
            _id: req.params.aid
        });
      } catch (err) {
        const error = new HttpError(
          'Something went wrong .',
          500
        );
        return next(error);
      }

      if (exam1) {
      
        res.json({ 
         exam: exam1
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
          isExam: true
      });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong .',
        500
      );
      return next(error);
    }

    if (course1) {
      let exams;
      let examArr = [];
      for(const exam of course1.exams){
        try {
            exams = await Assignment.findOne({
            _id: exam,
          })} catch (err) {
            const error = new HttpError(
              'Something went wrong, could not find a course.',
              500,
            );
            return next(error);
          }
          console.log(exams)
          examArr.push(exams);
        }
    
      res.json({ 
        exams: examArr
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a assignment.',
          500
        );
      }    

});

router.get("/getStudentExam/aid=:aid", async (req, res, next) => {
  let exam1;
  try {
    exam1 = await StudentAssignment.findOne({
          _id: req.params.aid
      });
    } catch (err) {
      const error = new HttpError(
        'Something went wrong .',
        500
      );
      return next(error);
    }

    if (exam1) {
    
      res.json({ 
       exam: exam1
      });
  } else {
      const error = new HttpError(
          'Something went wrong, could not find a assignment.',
          500
        );
      }    

});

router.get("/getStudentExam/sid=:sid", async (req, res, next) => {
let student1;
try {
  student1 = await Student.findOne({
        _id: req.params.sid,
        isExam: true
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong .',
      500
    );
    return next(error);
  }

  if (student1) {
    let exams;
    let examArr = [];
    for(const exam of student1.exams){
      try {
        exams = await StudentAssignment.findOne({
          _id: exam,
        })} catch (err) {
          const error = new HttpError(
            'Something went wrong, could not find a course.',
            500,
          );
          return next(error);
        }
        console.log(exams)
        examArr.push(exams);
      }
  
    res.json({ 
        exams: examArr
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
