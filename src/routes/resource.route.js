const express = require('express')
const router = express.Router()

const {upload} = require('../helpers/filehelper');

const { validationResult } = require('express-validator');

const Resource = require('../models/resource.model');
const Course = require('../models/course.model');
const HttpError = require('../models/http-error.model');

//Upload assignment route
router.post("/upload/lectureNotes/cid=:cid",upload.single('file'),  async (req, res, next) => {

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
            const file = new Resource({
                course: course1,
                title: req.body.title,
                description: req.body.description,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00,
                uploadedDate: Date.now(),
                isLectureNotes: true,
                isLectureVideos: false,
                isExam: false,
                isOtherResources: false
            });
            await file.save();
            console.log(file)
            course1 =  await Course.updateOne(
              {_id: req.params.cid} ,
              {$push: { lecturerNotes: file } ,
            });
            
          }catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(course1)
          res.redirect('/course/id='+req.params.cid);
        
        }
});

//Upload assignment route
router.post("/upload/lectureVideos/cid=:cid",upload.single('file'),  async (req, res, next) => {

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
            const file = new Resource({
                course: course1,
                title: req.body.title,
                description: req.body.description,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00,
                uploadedDate: Date.now(), 
                isLectureNotes: false,
                isLectureVideos: true,
                isExam: false,
                isOtherResources: false

            });
            await file.save();
            console.log(file)
            course1 =  await Course.updateOne(
              {_id: req.params.cid} ,
              {$push: { lecturerVideos: file } ,
            });
            
          }catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(course1)
          res.redirect('/course/id='+req.params.cid);
        
        }
});

//Upload assignment route
router.post("/upload/exams/cid=:cid",upload.single('file'),  async (req, res, next) => {

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
            const file = new Resource({
                course: course1,
                title: req.body.title,
                description: req.body.description,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00,
                uploadedDate: Date.now(),
                isLectureNotes: false,
                isLectureVideos: false,
                isExam: true,
                isOtherResources: false
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
          if(course1)
          res.redirect('/course/id='+req.params.cid);
        
        }
});

//Upload assignment route
router.post("/upload/otherResources/cid=:cid",upload.single('file'),  async (req, res, next) => {

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
            const file = new Resource({
                course: course1,
                title: req.body.title,
                description: req.body.description,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2), // 0.00,
                uploadedDate: Date.now(),
                isLectureNotes: false,
                isLectureVideos: false,
                isExam: false,
                isOtherResources: true
            });
            await file.save();
            console.log(file)
            course1 =  await Course.updateOne(
              {_id: req.params.cid} ,
              {$push: { otherResources: file } ,
            });
            
          }catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(course1)
          res.redirect('/course/id='+req.params.cid);
        
        }
});


router.get("/getResources/cid=:cid", async (req, res, next) => {
  let course1;
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

    if (course1) {
      let lecturerNote;
      let resourceArr = [];
      for(const lecturerNotes of course1.lecturerNotes){
        try {
            lecturerNote = await Resource.findOne({
            _id: lecturerNotes,
          })} catch (err) {
            const error = new HttpError(
              'Something went wrong, could not find a course.',
              500,
            );
            return next(error);
          }
          console.log(lecturerNote)
          resourceArr.push(lecturerNote);
        }
    
      res.json({ 
        lecturerNotes: resourceArr
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
