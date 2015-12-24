/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application

 Session Module Singleton.
 */

/**
 * Keep regist of all the current active sessions.
 */
var session = function session() {

    var sessions = {};

    /**
     * Add user to session.
     * @param username users name.
     * @param sessionID users session identifier.
     */
    this.addUser = function (username, sessionID) {
        sessions[username] = sessionID;
    };

    /**
     * Verify users session.
     * @param username users name.
     * @param sessionID users session identifier.
     */
    this.checkUser = function (username, sessionID) {
        return sessions[username] == sessionID;
    };

    /**
     * Retrieve users session.
     * @param sessionID users session identifier.
     */
    this.getUser = function (sessionID) {
        for(var prop in sessions) {
            if(sessions.hasOwnProperty(prop)) {
                if(sessions[prop] === sessionID)
                    return prop;
            }
        }
        return null;
    };

    /**
     * Remove user session.
     * @param username users name.
     */
    this.removeUser = function (username) {
        delete sessions[username];
    };
    
    /**
     * Get list of usernames.
     */
    this.getUsernames = function(){
        return Object.keys(sessions);
    }

    /**
     * Get session identifier.
     */
    this.getUserSessionID = function(username){
        return sessions[username];
    }

    if (session.caller != session.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
};

/**
 * Singleton Object definition.
 * @type {null}
 */
session.instance = null;

session.getInstance = function () {
    if (this.instance === null) {
        this.instance = new session();
    }
    return this.instance;
};

module.exports = session.getInstance();