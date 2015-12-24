/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Video conference Module.
 */
var request = require('request');
var request_json = require('request-json');
//var client = request_json.createClient('http://hidden-journey-1532.herokuapp.com/api/');
var client = request_json.createClient('http://192.168.215.91:5555/api/');
var vcsession = require('./vcSession');

/**
 *
 * @param tableID
 * @param cb
 */
module.exports.vcHappening = function(tableID, cb){
    vcsession.verifyTableInSession(tableID, function(data){
        cb(data);
    });
};

/**
 * Add Peer to Video conference session.
 * @param tableID table identifier.
 * @param sessionID user session identifier.
 */
module.exports.addPeer = function(tableID, username, sessionID){
    vcsession.addPeer(tableID, username, sessionID);
};

/**
 * Start table video conference.
 * @param tabledID table identifier.
 * @param sessionID user session identifier.
 * @param cb
 */
module.exports.startTableVC = function(tableID, sessionID, cb){

    vcsession.checkUserReadyInTable(tableID, sessionID, function(data){
        if (data === false){
           console.log("Problems with user connection to table");
           return cb(data);
       }
       else{
	    console.log(data);
            var peer = [];
            peer.push(sessionID);
            var people = { people: peer };
            client.post('connectPeople/', people, function(err, res, body){
                if(body.status == 'success'){
                    vcsession.newVideoConferenceRoomSet(tableID, body.room, sessionID);
                    return cb(true);
                }
                else return cb(false);
            });
       }
    });
};


module.exports.addToVC = function(tableID, sessionID, cb){

    vcsession.checkUserReadyInTable(tableID, sessionID, function(data){
        if (data === false){
            console.log("Problems with user connection to table");
            return cb(data);
        }
        else{
            vcsession.getRoomID(tableID, function(roomID){
                if(roomID){
                    var peer = [];
                    peer.push(sessionID);
                    var result = { people: peer, room: roomID};
                    client.post('connectPeopleToRoom/', result, function(err, res, body){
                        if(body.status == 'success'){
                            vcsession.addPeerToTableVideoConference(tableID, roomID, sessionID);
                            return cb(true);
                        }
                        else return cb(false);
                    });
                }
                else return cb(false);
            });
        }
    });
};

module.exports.disconnectFromVC = function(tableID, sessionID, username, cb){

    // VALIDATIONS
    vcsession.checkUserAlreadyInSession(tableID, sessionID, function(check){
        if (check == true){
            vcsession.getRoomID(tableID, function(roomID){
                var data = {
                    people: [sessionID],
                    room: roomID
                };
                client.post('disconnectPeopleFromRoom/', data, function(err, res, body){
                    if(body.status == 'success'){
                        vcsession.removePeerFromTableVideoConference(roomID, sessionID, tableID, username, function(len){
                            return cb(len);
                        });
                    }
                    else return cb(false);
                });
            });
        }
        else{

        }
    });

};

