/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 User Data Model Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema for User Collection in MongoDB.
 */
var userSchema = new Schema({
    username: String,
    password: String, //hash created from password
    course: Number,
    subjects: [Number],
    gravemail: String,
    created_at: {type: Date, default: Date.now}
});

/**
 * Update user information.
 * @param username username of the user to update.
 * @param course course identifier.
 * @param subjects array containing subjects identifiers.
 * @param callback with the user document as result.
 */
userSchema.statics.addInfo = function(username, course, subjects, callback){
    this.findOne({'username': username}, function(err, user){
        user.course = course;
        user.subjects = subjects;
        user.save(callback);
    });
};

/**
 * Update user gravatar email.
 * @param username username of the user to update.
 * @param gravemail gravatar email address
 * @param callback with the user document as result.
 */
userSchema.statics.addGrav = function(username, gravemail, callback){
    this.findOne({'username': username}, function(err, user){
        console.log("Gravatar email address? - " + gravemail);
        user.gravemail = gravemail;
        user.save(callback);
    });
};

/**
 * Get user gravatar email.
 * @param username username of the user to update.
 * @param callback with the user document as result.
 */
userSchema.statics.getGrav = function(username, callback){
    this.findOne({'username': username}, function(err, user){
        if(err)
            callback(err);
        callback(user);
    });
};

/**
 * Get user subscribed subjects.
 * @param username username of the user.
 * @param callback with the user document as result.
 */
userSchema.statics.subscribedCourses = function(username, callback){
    this.findOne({'username': username}, function(err, user){
        if(err)
            callback(err);
        callback(user);
    });
};

/**
 * Get user's course.
 * @param username username of the user.
 * @param callback
 */
userSchema.statics.getUserCourse = function(username, callback){
    this.findOne({'username': username}, function(err, user){
        if(err)
            callback(err);
        callback(user);
    });
};

/**
 * Export Mongoose Model.
 */
mongoose.model('User', userSchema);
module.exports = mongoose.model('User');