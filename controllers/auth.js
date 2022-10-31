const express = require('express');
const { validationResult } = require('express-validator');
const userModel = require('../models/user')
const courseModel = require('../models/course')
const bycrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

exports.signup = (req, res, next) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation faild');
        error.statusCode = 422;
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.password;

    bycrypt.hash(password, 12).then(hashpw => {
        const user = new userModel({
            email: email,
            password: hashpw,
            name: name,
        });
        return user.save();
    }).then(result => {
        res.status(201).json({ message: 'user created successfuly', userID: result._id });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    user.findOne({ email: email }).select("+password").then(user => {
        if (!user) {
            const error = new Error('user couldnot found check your email or pass')
            error.statusCode = 401;
            throw error;
        }

        loadedUser = user;
        return bycrypt.compare(password, user.password);

    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('user couldnot found check your email or pass')
            error.statusCode = 401;
            throw error;
        }
        // create jwt
        const Token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id
        }, process.env.APP_SEC, { expiresIn: '1h' });

        res.status(200).json({ tokken: Token, userId: loadedUser._id });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

exports.addCourse = (req, res, next) => {
    const userId = req.userId;
    const courseId = req.params.id;
    let userfound;
    // get loged in user 
    userModel.findById(userId).then(user => {
        userfound = user;
        // get course 
        courseModel.findById(courseId).then(course => {
            if (!course.prerequisite.every((e) => userfound.skills.indexOf(e) != -1)) {
                // user dont have the required skills 
                // ask him to connect us to take interview for decide 
                // if he can take this cource or not
                const error = new Error('dont have the prerequisite required for this course you can send request to email admin@admin.com to have interveiw for this course')
                error.statusCode = 500;
                throw error;
            }
            if (userfound.courses.includes(course._id)) {
                const error = new Error('you have this course already')
                error.statusCode = 500;
                throw error;
            }
            userfound.courses.push(course._id);
            // userfound.skills = [...userfound.skills, ...course.skills]
            userfound.skills = userfound.skills.concat(course.skills).unique();
            return userfound.save();
        }).then(result => {
            res.status(200).json({ message: 'course added successfuly successfuly', userId: result._id });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    })
}

exports.getUsers = (req, res, next) => {
    user.find()
        .then(result => {
            res.status(200).json({ message: "fetch users successfuly", users: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.getUserDetails = (req, res, next) => {
    const userID = req.params.id;

    courseModel.findById(userID).then(result => {
        // no course with this id 
        if (!result) {
            const error = new Error('could not be found !');
            error.statusCode = 404;
            throw error;
        }
        //find course with this id
        res.status(200).json({ message: 'course fetch successfuly', user: result });

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.updateAdmins = (req, res, next) => {
    const userId = req.params.id;

    const isAdmin = req.body.isAdmin;

    userModel.findById(userId).then(user => {

        if (!user) {
            const error = new Error('could not be found !');
            error.statusCode = 404;
            throw error;
        }

        user.isAdmin = isAdmin;

        return user.save();

    }).then(result => {
        res.status(200).json({ message: 'user upadated successfuly', user: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;
    userModel.findById(user).then(user => {
        if (!user) {
            const error = new Error('not found')
            error.statusCode = 404;
            throw error;
        }
        return userModel.findByIdAndDelete(userId)
    }).then(result => {
        res.status(200).json({message:"user has been deleted"})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}