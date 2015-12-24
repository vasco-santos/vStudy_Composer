/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Tables REST API
 */
var express = require('express');
var async = require('async');
var router = express.Router();
var mongoose = require('mongoose');
var Table = mongoose.model('Table');
var session = require('./modules/session');
var videoconference = require('./modules/videoconference');
var im = require('./modules/im');
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
 * Register the authentication middleware.
 */
router.use('/allTables', isAuthenticated);

/**
 * Get all available tables of a subject.
 */
router.route('/allTables')
    .get(function (req, res) {
        Table.getSubjectTables(req.param('code'), function (err, tables) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(tables);
        });
    });

/**
 * Register the authentication middleware.
 */
router.use('/addTable', isAuthenticated);

/**
 * Add a new table to a subject.
 */
router.route('/addTable')
    .post(function (req, res) {
        var newTable = req.body;
        Table.addTable(newTable.uc, newTable.name, newTable.description,
            true, newTable.creator, function (err, table) {
                if (err) {
                    return res.send(500, err);
                }
                im.sendMessage('MULTIUSER',{
                    //username: 'mvicente12345',
                    username: req.user.username,
                    room: table._id,
                    sessionid: req.sessionID
                });
                console.log("add table:" + table._id);
                fsModule.addMember(table._id, req.sessionID, function(data){
                    if (data){
                        return res.json(table._id);
                    }
                    else{
                        return res.send(500, err);
                    }
                });
            });
    });

/**
 * Register the authentication middleware.
 */
router.use('/tableCurrentInfo', isAuthenticated);

/**
 * Get table current information.
 */
router.route('/tableCurrentInfo')
    .get(function (req, res) {
        console.log(req.param('tableID'));
        Table.getTableInfo(req.param('tableID'), function (err, table) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(table);
        })
    });

/**
 * Register the authentication middleware.
 */
router.use('/joinTable', isAuthenticated);

/**
 * Join user to a table.
 */
router.route('/joinTable')
    .get(function (req, res) {
        Table.wantToJoinTable(req.param('tableID'), req.param('username'), function (err, table) {
            if (err) {
                

                return res.send(500, err);
            }
            fsModule.addMember(req.param('tableID'), req.sessionID, function(data){
                if (data){
                    return res.json(table._id);
                }
                else{
                    return res.send(500, err);
                }
            });
        });
    });

/**
 * Register the authentication middleware.
 */
router.use('/leaveTable', isAuthenticated);

/**
 * Remove user from a table.
 */
router.route('/leaveTable')
    .get(function (req, res) {
        Table.leaveTable(req.param('tableID'), req.param('username'), function (err, table) {
            console.log(table);
            if (err) {
                return res.send(500, err);
            }
            return res.json(table);
        });
    });

/**
 * Register the authentication middleware.
 */
router.use('/removeTable', isAuthenticated);

/**
 * Remove a table from a subject.
 */
router.route('/removeTable')
    .get(function (req, res) {
        Table.removeTable(req.param('tableID'), function (err, removed) {
            if (err) {
                return res.send(500, err);
            }
            fsModule.removeGroupFiles(req.param('tableID'), function(data){
                if(data){
                    fsModule.removeGroup(req.param('tableID'), function(data){
                        if(data){
                            return res.json(removed);
                        }
                        else return res.send(500, err);
                    });
                }
                else return res.send(500, err);
            });
        });
    });

/**
 * Register the authentication middleware.
 */
router.use('/userTables', isAuthenticated);

/**
 * Get tables available for user subscribed subjects.
 */
router.get('/userTables', function (req, res) {
    var results = [];
    var subjects = req.param('subjects');
    if(typeof subjects === 'string')
        subjects = [subjects];
    async.each(subjects, function (subscribed, callback) {
        subscribed = JSON.parse(subscribed);
        Table.getSubjectTables(subscribed.code, function (err, tables) {
            results.push({
                'name': subscribed.name,
                'code': subscribed.code,
                'tables': tables
            });
            callback();
        })
    }, function (err) {
        if (err)
            return res.send(500, err);
        else return res.send(200, results);
    });
});

// VideoConference

/**
 * Register the authentication middleware.
 */
router.use('/startVC', isAuthenticated);

/**
 * Start Videoconference room.
 */
router.get('/startVC', function (req, res){
    videoconference.startTableVC(req.param('tableID'), req.sessionID, function(data){
        return res.send(200, data);
    });
});

/**
 * Register the authentication middleware.
 */
router.use('/getVCState', isAuthenticated);

/**
 *
 */
router.use('/getVCState', function(req, res){
    videoconference.vcHappening(req.param('tableID'), function(data){
        if(data){
            return res.send(200, true);
        }
        else return res.send(200, false);
    });
});

module.exports = router;