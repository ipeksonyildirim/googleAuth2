const express = require('express')
const router = express.Router()
var faker = require('faker');
const fs = require('fs-extra');
const fs_for_mkdir = require('fs');
const path = require('path');
const busboy = require('busboy');

const { validationResult } = require('express-validator');

const Assignment = require('../models/assignment.model');
const Course = require('../models/course.model');
const Student = require('../models/student.model');
const HttpError = require('../models/http-error.model');

//Upload assignment route
router.post("/upload/cid=:cid", async (req, res, next) => {

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
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(!course1){
            const error = new HttpError(
                'Something went wrong .',
                500
              );
              return next(error);
          }

         /* assignment1 = new Assignment({
            course: course,
            title: req.body.title,
            file: { type: String },
            fileExtension: { type:String, required: true },
            directory: { type: String, required: true },
            description: { type: String },
            date: { type: Date },
            
        });*/

        
            const courseId = course1.code;
            const upload_path = assignment1.directory + courseId;

            if (!fs_for_mkdir.existsSync(upload_path)){
                fs_for_mkdir.mkdirSync(upload_path);
            }

            let fileStream;
            const newObjectID = mongoose.Types.ObjectId();
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldName, file, fileName) {
                const fileExtension = path.extname(fileName);
                console.log("Uploading: " + fileName);
                //Path where homework will be uploaded
                fileStream = fs.createWriteStream(upload_path + "/" +  newObjectID + fileExtension);
                file.pipe(fileStream);
                fileStream.on('close', function () {
                    const assignment = new Assignment({
                        _id: newObjectID,
                        course: course1,
                        title: fileName,
                        file: file,
                        fileExtension: fileExtension,
                        date: new Date()
                    });
                    assignment.save().catch((err) => {
                        const error = new HttpError(
                            'Something went wrong .',
                            500
                          );
                          return next(error);
                    });
                    console.log("Upload Finished of " + newObjectID + fileExtension);
                    course1.assignments.push(assignment);
                    res.status(200).json({
                        message: "Assignment upload Success"
                    });
                });
        
    });
}
});

//Upload homework route for student
router.post("/upload/aid=:aid", async (req, res, next) => {

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
          if(!assignment1){
            const error = new HttpError(
                'Something went wrong .',
                500
              );
              return next(error);
          }

          try {
            student1 = await Student.findOne({
                assignment: assignment1
            });
            course1 = await Course.findOne({
                assignments: { "$in" : [assignment1]}
            })
          } catch (err) {
            const error = new HttpError(
              'Something went wrong .',
              500
            );
            return next(error);
          }
          if(!student1 || !course1) {
            const error = new HttpError(
                'Something went wrong .',
                500
              );
              return next(error);
          }

            const studentId = student1.id
            const courseId = course1.code;
            const upload_path = assignment1.directory + courseId + "/" + studentId;
            /*  
            if (!fs_for_mkdir.existsSync(assignment1.directory + courseId)){
                fs_for_mkdir.mkdirSync(assignment1.directory + courseId);
            }
            */
            if (!fs_for_mkdir.existsSync(upload_path)){
                fs_for_mkdir.mkdirSync(upload_path);
            }

            let fileStream;
            const newObjectID = mongoose.Types.ObjectId();
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldName, file, fileName) {
                const fileExtension = path.extname(fileName);
                console.log("Uploading: " + fileName);
                //Path where homework will be uploaded
                fileStream = fs.createWriteStream(upload_path + "/" +  newObjectID + fileExtension);
                file.pipe(fileStream);
                fileStream.on('close', function () {
                    const assignment = new Assignment({
                        _id: newObjectID,
                        course: course1,
                        title: fileName,
                        file: file,
                        fileExtension: fileExtension,
                        date: new Date()
                    });
                    assignment.save().catch((err) => {
                        const error = new HttpError(
                            'Something went wrong .',
                            500
                          );
                          return next(error);
                    });
                    console.log("Upload Finished of " + newObjectID + fileExtension);
                    student1.assignments.push(assignment);
                    res.status(200).json({
                        message: "Homework upload Success"
                    });
                });
        
    });
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

module.exports = router;
