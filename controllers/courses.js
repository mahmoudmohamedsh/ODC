const express = require('express');
const { validationResult } = require('express-validator');
const courseModel = require('../models/course')

exports.getCourses = (req, res, next) => {
    courseModel.find().then(result => {
        res.status(200).json({ message: 'fetchd courses succesfuly', posts: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    })
}

exports.getCourseDetails = (req, res, next) => {
    const courseId = req.params.id;

    courseModel.findById(courseId).then(result => {
        // no course with this id 
        if (!result) {
            const error = new Error('could not be found !');
            error.statusCode = 404;
            throw error;
        }
        //find course with this id
        res.status(200).json({ message: 'course fetch successfuly', course: result });

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.createCourse = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const skills = req.body.skills
    const instructor = req.body.instructor;
    const prerequisite = req.body.prerequisite;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation faild');
        error.statusCode = 422;
        throw error;
    }

    //image 
    if(!req.file){
        const error = new Error('no image provided ');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    console.log(imageUrl)
    console.log('we are here')
    const course = new courseModel({
        title: title,
        content: content,
        imageUrl: imageUrl ,
        instructor: instructor,
        skills: skills,
        prerequisite: prerequisite
    });

    course.save().then(result => {
        console.log(result);
        res.status(201).json({ message: 'course created successfuly', course: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

}

exports.updateCourse = (req, res, next)=>{
    const courseId = req.params.id;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation faild');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const skills = req.body.skills
    const instructor = req.body.instructor;
    const prerequisite = req.body.prerequisite;
    //image handling
    if(req.file){
        imageUrl = req.file.path;
    }
    
    if(!req.file){
        const error = new Error('no image provided ');
        error.statusCode = 422;
        throw error;
    }

    courseModel.findById(courseId).then(course => {
        // no course with this id 
        if (!course) {
            const error = new Error('could not be found !');
            error.statusCode = 404;
            throw error;
        }
        //find course with this id
        course.title = title;
        course.imageUrl = imageUrl;
        course.content = content;
        course.skills = skills;
        course.instructor = instructor;
        course.prerequisite = prerequisite;

        return course.save();

    }).then(result => {
        res.status(200).json({ message: 'course upadated successfuly', course: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}



exports.deleteCourse = (req, res, next) => {
    const courseId = req.params.id;
    courseModel.findById(courseId).then(course => {
        if (!course) {
            const error = new Error('not found')
            error.statusCode = 404;
            throw error;
        }
        return courseModel.findByIdAndDelete(courseId)
    }).then(result => {
        res.status(200).json({message:"course has been deleted"})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}