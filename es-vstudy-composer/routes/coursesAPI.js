/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Courses REST API
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Course = mongoose.model('Course');

/**
 * Get available courses.
 */
router.route('/courses')
    //gets all courses
    .get(function (req, res) {
        Course.find(function (err, courses) {
            if (err) {
                return res.send(500, err);
            }
            else return res.send(200, courses);
        });
    });

/**
 * gets all subjects of the course
 */
router.route('/course')
    .get(function (req, res) {
        Course.getSubjects(req.param('name'), function (err, subjects) {
            if (err)
                res.send(500, err);
            else res.json(subjects);
        });
    });

/**
 * gets subject Courses
 */
router.route('/subjectInfo')
    .get(function (req, res) {
        Course.getSubjectInfo(req.param('code'), function (err, courses) {
            if (err)
                res.send(500, err);
            else {
                var result = [];
                courses.forEach(function (course) {
                    result.push(course.name)
                });
                return res.json(result);
            }
        });
    });

/**
 * gets subject name by ID
 */
router.route('/subjectName')
    .get(function (req, res) {
        var name = '';
        Course.getSubjectName(req.param('code'), function (err, course) {
            if (err)
                return res.send(500, err);
            else {
                course.cadeiras.forEach(function (cadeira) {
                    if (cadeira.code == req.param('code')){
                        name = cadeira.name;
                    }
                });
                return res.json(200, name);
            }
        });
    });

module.exports = router;