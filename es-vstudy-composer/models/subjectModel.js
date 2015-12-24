/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Subject Data Model Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Subject schema for Subjects Collection in MongoDB
 */
var subjectSchema = new Schema({
    code: Number,
    name: String,
    description: String,
    created_at: {type: Date, default: Date.now}
});

/**
 * Export Mongoose Model.
 */
mongoose.model('Subject', subjectSchema);