const HttpError = require('../models/http-error.model');
const Student = require('../models/student.model')

const getStudent = async (req, res,next) => {
    try {
      let student = await Student.findById(req.params.id).populate('user').lean()
  
      if (!student) {
        const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
      }
  
      if (student.user._id != req.user.id) {
        const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
      } else {
        res.render('stories/show', {
          story,
        })
      }
    } catch (err) {
      const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
    }
  };

const editStudent = async (req, res,next) => {
    try {
      const student = await Student.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!student) {
        const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
      }
  
      if (student.user != req.user.id) {
        res.redirect('/dashboard')
      } else {
        res.render('stories/edit', {
          story,
        })
      }
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
  };

const updateStudent = async (req, res,next) => {
    try {
      let student = await Student.findById(req.params.id).lean()
  
      if (!student) {
        const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
      }
  
      if (student.user != req.user.id) {
        res.redirect('/dashboard')
      } else {
        student = await Student.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
  };

  const deleteStudent =  async (req, res,next) => {
    try {
      let student = await Student.findById(req.params.id).lean()
  
      if (!student) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
      }
  
      if (student.user != req.user.id) {
        res.redirect('/dashboard')
      } else {
        await Student.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
  }


  const addStudent =  async(req, res, next) => {
    try {
      req.body.user = req.user.id
      await Student.create(new User({
        id: '171301003',
        name:'Ipek Cemre Sonyildirim',
        lastName: 'Sonyildirim',
        email:'isonyildirim@etu.edu.tr',
        status: 'aktif',
        scholarship: 0.75,
        educationTerm:12,
        gpa: 3.70,
        degree: 4,
        secondForeignLanguage:{id:1, value: 'Almanca'},
  
      })
      )
      res.redirect('/dashboard')
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
  };
exports.getStudent = getStudent;
exports.editStudent = editStudent;
exports.addStudent = addStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;
exports.addStudent = addStudent;