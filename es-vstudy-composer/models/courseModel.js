/**
Aveiro University
MIECT - Services Engineering
    
    @author: Vasco Santos (64191)

Service Composition for vStudy Application

Course Data Model Schema
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Course schema for Courses Collection in MongoDB
 */
var courseSchema = new Schema({
	id: String,
	name: String,
	cadeiras: [{code: String, name: String}]
});

/**
 * Get course name by its identifier.
 * @param id course identifier.
 * @param callback with the course as a parameter.
 */
courseSchema.statics.getCourseName = function(id, callback){
    this.findOne({'id' : id}, function(err, course) {
        if (err)
            callback(err, null);
        callback(null, course);
    });
};

/**
 * Get course subjects by its identifier.
 * @param id course identifier.
 * @param callback with course as a parameter.
 */
courseSchema.statics.getSubjectsById = function(id, callback){
	this.findOne({'id' : id}, function(err, course){
		if (err)
			callback(err, null);
		callback(null, course);
	});
};

/**
 * Get course subjects by its name.
 * @param name course name.
 * @param callback with course as a parameter.
 */
courseSchema.statics.getSubjects = function (name, callback){
	this.findOne({'name' : name}, function(err, course){
        if (err)
            callback(err, null);
        callback(null, course);
    });
};

/**
 * Get Subject information by its code.
 * @param code subject code.
 * @param callback with course as a parameter.
 */
courseSchema.statics.getSubjectInfo = function (code, callback){
	this.find({'cadeiras.code': code}, function(err, course){
        if(err)
            callback(err, null);
        callback(null, course);
    });
};

/**
 * Get subject name by its code.
 * @param code subject code.
 * @param callback with course as a parameter.
 */
courseSchema.statics.getSubjectName = function (code, callback){
	this.findOne({'cadeiras.code': code}, function(err, course){
        if(err)
            callback(err, null);
        callback(null, course);
    });
};

/**
 * Export Mongoose Model.
 */
mongoose.model('Course', courseSchema);
module.exports = mongoose.model('Course');