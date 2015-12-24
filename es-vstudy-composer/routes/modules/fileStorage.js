/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 File Storage consumer for REST API
 */

var request = require('request');
var request_json = require('request-json');

//var url = 'http://192.168.215.91:3001/api/';
var url = 'http://localhost:3001/api/';
var client = request_json.createClient(url);

var addGroup = function(tableID, cb){

    client.post('groups/', { group: tableID,
                             temporary: "true",
                             public: true
    }, function(err, res, body){
        console.log("FileSHaring status");
        console.log(res.statusCode);
        return cb(true);
    });
};

var addRepoGroup = function(tableID, cb){

    client.post('groups/', { group: tableID,
                             temporary: "false",
                             public: true
    }, function(err, res, body){
        console.log("FileSHaring status");
        console.log(res.statusCode);
        return cb(true);
    });
};

module.exports.removeGroup = function(tableID, cb){

    client.del('group/', { group: tableID,
        temporary: "true"
    }, function(err, res, body){
        console.log(res.statusCode);
        return cb(true);
    });
};

module.exports.removeGroupFiles = function(tableID, cb){

    client.del('groupfiles/', { group: tableID,
        temporary: "true"
    }, function(err, res, body){
        console.log(res.statusCode);
        return cb(true);
    });
};

module.exports.listGroupFiles = function(tableID, temp, cb){
    if(temp == "false"){
        checkGroupExistsAndCreate(tableID, function(){
            
        })
    }

    var options = {
        url: url + 'groupfiles/',
        headers:{
            group: tableID,
            temporary: temp
        }
    };
    request(options, function(err, res, body){
        if(res.statusCode == 200) {
            return cb(body);
        }
        else return cb(false);
    });
};

var checkGroupExistsAndCreate = function(tableID, cb){

    var options = {
        url: url + 'groupfiles/',
        headers:{
            group: tableID,
            temporary: "false"
        }
    };
    request(options, function(err, res, body){
        if(res.statusCode == 200){
            return cb(body);
        }
        else{
            addRepoGroup(tableID, function(result){
                cb(result);
            });
        };
    });
};

module.exports.addMember = function(tableID, sessionID, cb){

    client.post('members/', { group: tableID,
        memberid: sessionID
    }, function(err, res, body){
        return cb(true);
    });
};

module.exports.checkMemberAccess = function(tableID, sessionID, cb){

    var options = {
        url: url + 'members/',
        headers:{
            group: tableID,
            memberid: sessionID
        }
    };
    request(options, function(err, res, body){
        if(res.statusCode == 200) {
            return cb(body);
        }
        else return cb(false);
    });
};

module.exports.removeMember = function(tableID, sessionID, cb){

    client.del('members/', { group: tableID,
        memberid: sessionID
    }, function(err, res, body){
        console.log(res.statusCode);
        return cb(true);
    });
};

module.exports.publishFile = function(tableID, filename, ucCode, cb){
    
    checkGroupExistsAndCreate(ucCode, function(result){
        client.post('publish/', {filename: filename,
        temporary: tableID,
        final: ucCode},
        function(err, res, body){
            return cb(true);
        });
    });
    
};

module.exports.grabFile = function(ucCode, filename, tableID, cb){
    
}

module.exports.checkGroupExistsAndCreate = checkGroupExistsAndCreate;
module.exports.addGroup = addGroup;