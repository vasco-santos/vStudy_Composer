/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Video Conference service definition
 */
app.service('imService', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        /**
         * HTTP Get to the vStudy Server in order to start a video conference.
         * @param tableID table identification.
         * @param cb the status of the operation.
         */
        send: function(username, tableID, sessionID, message, cb){
            $rootScope.socket.emit('message:new', {username: username,
                                        tableID: tableID,
                                        sessionID: sessionID,
                                        text: message}, function(){
                cb(message);
            });
        },
        listenMessage: function(cb){
            $rootScope.socket.on('message:new', function(message){
                cb(message);
            });
            
        },
        listenLoadedMessages: function(cb){
            $rootScope.socket.on('message:loadedMessages', function(messages){
                console.log(messages);
                cb(messages);
            });
        }
    };
}]);