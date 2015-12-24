/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Video conference Session Module Singleton.
 */

/**
 * Keep regist of all the current active Video Conference sessions.
 */
var vcSession = function vcSession(){

    var tableSession = {};
    var conversationSession = {};
    var roomMapping = {};

    /**
     * Add peer to the session.
     * @param tableID table identifier.
     * @param sessionID session identifier.
     */
    this.addPeer = function(tableID, username, sessionID){
        var bool = false;
        var table = tableSession[tableID];
        if (table == null){
            tableSession[tableID] = [];
            tableSession[tableID].push({username: username,
                                        session: sessionID});
        }
        else{
            table.forEach(function(session){
                if(session == sessionID){
                    bool = true;
                }
            });
            if (bool == false){
                tableSession[tableID].push({username: username,
                    session: sessionID});
            }
            console.log(tableSession);
        }
    };

    /**
     * Get table peers to start Video Conference.
     * @param tableID table identifier.
     * @param sessionID session identifier.
     * @param cb
     * @returns {*}
     */
    this.checkUserReadyInTable = function(tableID, sessionID, cb){
        var table = tableSession[tableID];
	console.log('Table');
        console.log(table);
	cb(verify(table, sessionID));
    };

    this.checkUserAlreadyInSession = function(tableID, sessionID, cb){
        var table = conversationSession[roomMapping[tableID]];
        cb(verify(table, sessionID));
    };

    var verify = function(table, sessionID){
        var bool = false;

        if (table == null){
            return false;
        }
        table.forEach(function(user){
            if(user.session == sessionID){
                bool = true;
            }
        });
        if(bool == false){
            return false;
        }
        else{
            return true;
        }
    };

    this.newVideoConferenceRoomSet = function(tableID, roomID, sessionID){
        var table = tableSession[tableID];
        tableSession[tableID] = table.filter(function(element){
            return  element.session !==sessionID;
        });
        roomMapping[tableID] = roomID;
        conversationSession[roomID] = [];
        conversationSession[roomID].push({session: sessionID});
    };

    this.addPeerToTableVideoConference = function(tableID, roomID, sessionID){
        var table = tableSession[tableID];
        tableSession[tableID] = table.filter(function(element){
            return  element.session !==sessionID;
        });
        conversationSession[roomID].push({session: sessionID});
    };

    this.removePeerFromTableVideoConference = function(roomID, sessionID, tableID, username, cb){
        var bool = false;
        var table = conversationSession[roomID];
        conversationSession[roomID] = table.filter(function(element){
            return  element.session !==sessionID;
        });
        var len = conversationSession[roomID].length;
        if (len == 0){
            conversationSession[roomID] = [];
        }
        table = tableSession[tableID];
        if (table == null){
            tableSession[tableID] = [];
            tableSession[tableID].push({username: username,
                session: sessionID});
        }
        else{
            table.forEach(function(session){
                if(session == sessionID){
                    bool = true;
                }
            });
            if (bool == false){
                tableSession[tableID].push({username: username,
                    session: sessionID});
            }
        }
        cb(len);
    };

    this.getRoomID = function(tableID, cb){
        cb(roomMapping[tableID]);
    };

    this.getTableSession = function(cb){
        cb(tableSession);
    };

    this.verifyTableInSession = function(tableID, cb){
        var aux = roomMapping[tableID];
        if(aux){
            if (conversationSession[aux].length)
                cb(true);
            else cb(false);
        }
        else{
            cb(false);
        }
    };

    if (vcSession.caller != vcSession.getInstance){
        throw new Error("This object cannot be instanciated");
    }
};

/**
 * Singleton Object definition.
 * @type {null}
 */
vcSession.instance = null;

vcSession.getInstance = function(){
    if (this.instance === null){
        this.instance = new vcSession();
    }
    return this.instance;
};

module.exports = vcSession.getInstance();
