/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Repository REST API
 */

var express = require('express');
var router = express.Router();
var session = require('./modules/session');
var fsModule = require('./modules/fileStorage');

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
    return res.send(401, '#login/');
}

/**
 * Get repository courses.
 */
router.route('/repositoryCourses')
    .get(function (req, res) {

        return res.send(200, "HTTP GET SUCCESS");
    });

// UserID, TableID, filename

/**
 * Register the authentication middleware.
 */
router.use('/uploadFile', isAuthenticated);

/**
 * Upload file to the repository server.
 */
router.route('/uploadFile')
    .post(function (req, res) {
        fsModule.uploadFile(function (result) {
            return res.send(200, result);
        });
    });

/**
 * Register the authentication middleware.
 */
router.use('/downloadFile', isAuthenticated);

/**
 * Download file from the repository server.
 */
router.route('/downloadFile')
    .get(function (req, res) {
        fsModule.downloadFile(function (result) {
            return res.send(200, result);
        });
    });

/**
 * Register the authentication middleware.
 */
router.use('/listFiles', isAuthenticated);

/**
 * Get the repository files from a subject.
 */
router.route('/listFiles')
    .get(function (req, res) {
        fsModule.listFiles(function (result) {
            return res.send(200, result);
        });
    });

module.exports = router;