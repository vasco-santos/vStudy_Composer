/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Courses REST API
 */

var express = require('express');
var router = express.Router();
var session = require('./modules/session');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Course = mongoose.model('Course');
var im = require('./modules/im');

/**
 * Module using Passport.
 * @param passport passport object.
 * @returns {*}
 */
module.exports = function (passport) {

    /**
     * Used for routes that must be authenticated.
     * @param req request
     * @param res response
     * @param next next type.
     * @returns {*}
     */
    function isAuthenticated(req, res, next) {
        // if user is authenticated in the session, call the next() to call the next request handler
        // Passport adds this method to request object.
        if (req.isAuthenticated()) {
            if (session.checkUser(req.user.username, req.sessionID)) {
                return next();
            }
            else {
                return res.send(451, "Unauthorized: User with no valid session.");
            }
        }
        // if the user is not authenticated then redirect him to the login page
        return res.send(401, '/login');
    }

    /**
     * Register the authentication middleware.
     */
    router.use('/userSubjects', isAuthenticated);

    /**
     * Get user subscribed courses.
     */
    router.get('/userSubjects', function (req, res) {
        var subjects = [];
        User.subscribedCourses(req.user.username, function (data) {
            Course.getSubjectsById(data.course.toString(), function (err, data2) {
                data2.cadeiras.forEach(function (cadeira) {
                    data.subjects.forEach(function (subscribed) {
                        if (subscribed === parseInt(cadeira.code)) {
                            subjects.push(cadeira);
                        }
                    });
                });
                return res.send(200, subjects);
            });
        });
    });

    /**
     * Register the authentication middleware.
     */
    router.use('/addInfo', isAuthenticated);

    /**
     * Add user Information
     */
    router.post("/addInfo", function (req, res) {
        console.log("AddInfo");
        console.log(req.user.username);
        console.log(req.body.courseInfo.id);
        console.log(req.body.courseInfo.subjects);
        User.addInfo(req.user.username, req.body.courseInfo.id, req.body.courseInfo.subjects, function (data) {
            res.send({state: 'success', text: "DONE"});
        });
    });

    /**
     * Add user gravatar email
     */
    router.post("/addGrav", function (req, res) {
        User.addGrav(req.user.username, req.body.gravemail, function (data) {
            res.send({state: 'success', text: "DONE"});
        });
    });

    /**
     * Get user gravatar email
     */
    router.get("/getGrav", function (req, res) {
        User.getGrav(req.param('user'), function (data) {
            res.send(200, data.gravemail);
        });
    });

    /**
     * Get user by sessionId
     */
    router.get("/getUserBySession", function (req, res) {
        var val = session.getUser(req.param('sessionId'));
        res.send(200, val);
    });

    /**
     * Register the authentication middleware.
     */
    router.use('/userInfo', isAuthenticated);

    /**
     * Get user Information.
     */
    router.get('/userInfo', function (req, res) {
        User.getUserCourse(req.user.username, function (user) {
            Course.getCourseName(user.course, function (err, course) {
                res.send(200, course.name);
            });
        });
    });

    /**
     * Try to reauthenticate user session.
     */
    router.post("/reauthenticate", function (req, res) {
        if (req.user && session.checkUser(req.user.username, req.sessionID)) {
            res.send({state: 'success', user: req.user});
        }
        else {
            res.send({state: 'failure', user: null});
        }
    });

    /**
     * sends successful login state back to client.
     */
    router.get('/success', function (req, res) {
        // Keep Session
        if (req.user) {
            ret = {
                "username": req.user.username,
                "id": req.sessionID
            };
            session.addUser(req.user.username, req.sessionID);
        }
        else
            ret = null;
        // Register to Instant Messaging
        im.sendMessage('LOGIN', {
            sessionid: req.sessionID,
            username: req.user.username,
            pass: "1234567"
        });
        res.send({state: 'success', user: ret});
    });

    /**
     * sends failure login state back to client.
     */
    router.get('/failure', function (req, res) {
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

    /**
     * Try to login a user, using passport.
     */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/authenticationAPI/success',
        failureRedirect: '/authenticationAPI/failure'
    }));

    /**
     * Try to signup a user, using passport.
     */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/authenticationAPI/success',
        failureRedirect: '/authenticationAPI/failure'
    }));

    /**
     * Try to log out a user.
     */
    router.get('/signout', function (req, res) {
        session.removeUser(req.param('username'));
        req.logout();
        res.redirect('/');
    });

    return router;
};
