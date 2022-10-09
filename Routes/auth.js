const express = require('express')
const authController = require('../controllers/auth')
const {body} = require('express-validator/check')
const userModel = require('../models/user')
const isAuth = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')
const isAdminadmin = require('../middleware/is-adminadmin')

const router = express.Router()
// POST /auth/signup
// new user added
router.post('/signup',[
    body('email').isEmail().withMessage('please ennter a vaild email.').custom((value,{req})=>{
        return userModel.findOne({email:value}).then(userDoc =>{
            if(userDoc){
                return Promise.reject('email address already exist !');
            }
        })
    }).normalizeEmail(),

    body('password').trim().isLength({min:5}),
    body('name').trim().not().isEmpty()

],authController.signup)
// POST  /auth/login 
router.post('/login',authController.login)
// POST /auth/addCourse/:id
// add course and its skills to user profile
// only admin have access to this url
router.post('/addCourse/:id',isAuth,authController.addCourse)
/**
 * AdminAdmin routes "owner of the website"
 * 
 */

// GET /auth/users
// return all users
router.get('/users',isAuth,isAdmin,isAdminadmin,authController.getUsers)
// GET /auth/users/:id
// get single user data except the password
router.get('/users/:id',isAuth,isAdmin,isAdminadmin,authController.getUserDetails)
// PUT /auth/users/:id
// change the user access form user to admin and vice versa
router.put('/users/:id',isAuth,isAdmin,isAdminadmin,authController.updateAdmins)
// DELETE /auth/users/:id
router.delete('/users/:id',isAuth,isAdmin,isAdminadmin,authController.deleteUser)
module.exports = router;