const express = require('express')
const coursesController = require('../controllers/courses')
const {body} = require('express-validator/check')
const isAuth = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')

const router = express.Router()


// GET /course/
// acccess all courses in db 
router.get('/',coursesController.getCourses);
// GET /course/:id
// get single post 
router.get('/:id',coursesController.getCourseDetails);

// POST /course/
// add new course to db 
// admin only can create the courses
router.post('/',isAuth,isAdmin,[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5}),
    body('instructor').trim().isLength({min:5})],coursesController.createCourse);
// PUT /course/:id
// update single post 
// admin only can update the courses
router.put('/:id',isAuth,isAdmin,[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5}),
    body('instructor').trim().isLength({min:5})],coursesController.updateCourse)
//
router.delete('/:id',isAuth,isAdmin,coursesController.deleteCourse);
module.exports = router;