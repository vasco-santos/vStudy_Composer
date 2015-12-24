/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Table Data Model Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Table schema for Tables Collection in MongoDB.
 */
var tableSchema = new Schema({
    tag: {type: String, default: 'PT-UA'},
    subject: Number,
    name: String,
    description: String,
    visibility: Boolean,
    members: [String],
    created_by: String,
    created_at: {type: Date, default: Date.now}
});

/**
 * Add a new Table.
 * @param subject subject code.
 * @param name  course name.
 * @param description of the course.
 * @param visibility table visibility.
 * @param username owner of the table.
 * @param callback table document as result.
 */
tableSchema.statics.addTable = function (subject, name, description, visibility, username, callback) {
    var table = new this();
    table.subject = subject;
    table.name = name;
    table.description = description;
    table.visibility = visibility;
    table.members = [];
    table.members.push(username);
    table.created_by = username;
    table.save(callback);
};

/**
 * Get all the tables of a subject currently online.
 * @param code table code.
 * @param callback with an array of tables as result.
 */
tableSchema.statics.getSubjectTables = function (code, callback) {
    this.find({'subject': code}, function (err, table) {
        if (err)
            callback(err, null);
        callback(null, table);
    });
};

/**
 * Get table information by its identifier.
 * @param id table identifier.
 * @param callback with the table document as result.
 */
tableSchema.statics.getTableInfo = function (id, callback) {
    this.findOne({'_id': id}, function (err, table) {
        if (err)
            callback(err, null);
        callback(null, table);
    });
};

/**
 * Add a user to an existing table.
 * @param id table identifier.
 * @param username username of the user.
 * @param callback with the table document as result.
 */
tableSchema.statics.wantToJoinTable = function (id, username, callback) {
    this.findOne({'_id': id}, function (err, table) {
        var found = table.members.indexOf(username) > -1;
        if (!found)
            table.members.push(username);
        table.save(callback);
    });
};

/**
 * Remove user from a table.
 * @param id table identifier.
 * @param username username of the user.
 * @param callback with the table document as result.
 */
tableSchema.statics.leaveTable = function (id, username, callback) {
    this.findByIdAndUpdate(id, {$pull: {"members": username}},
        function (err, table) {
            if (err) {
                return callback(err);
            }
        });
    this.findOne({'_id': id}, callback);
};

/**
 * Remove table from a subject.
 * @param id table Identifier.
 * @param callback with the success message.
 */
tableSchema.statics.removeTable = function (id, callback) {
    this.remove({'_id': id}, callback);
};

// Fazer Table expired

/**
 * Export Mongoose Model.
 */
mongoose.model('Table', tableSchema);
module.exports = mongoose.model('Table');