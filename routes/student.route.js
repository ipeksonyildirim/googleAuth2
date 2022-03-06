const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const studentController = require('../controllers/student.controller')

/*

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

// @desc    Process add form
// @route   POST /student
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Student.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
*/
// @desc    Add student 
// @route   GET /student/add
router.get('/add', ensureAuth, studentController.addStudent)

// @desc    Show student 
// @route   GET /student/:id
router.get('/:id', ensureAuth, studentController.getStudent)

// @desc    Show edit page
// @route   GET /student/edit/:id
router.get('/edit/:id', ensureAuth,studentController.editStudent )

// @desc    Update student
// @route   PUT /student/:id
router.put('/:id', ensureAuth,studentController.updateStudent )

// @desc    Delete student
// @route   DELETE /student/:id
router.delete('/:id', ensureAuth, studentController.deleteStudent)

module.exports = router