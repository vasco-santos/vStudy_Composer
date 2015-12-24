/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Video Conference service definition
 */
app.service('vcService', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        /**
         * HTTP Get to the vStudy Server in order to start a video conference.
         * @param tableID table identification.
         * @param cb the status of the operation.
         */
        start: function(sessionID, tableID, cb){
            $rootScope.socket.emit('vc:start', {
                    tableID: tableID,
                    sessionID: sessionID},
                function(){
                    cb(message);
                });
        },
        join: function(sessionID, tableID, cb){
            $rootScope.socket.emit('vc:join', {
                    tableID: tableID,
                    sessionID: sessionID},
                function(){
                    cb(message);
                });
        },
        end: function(sessionID, tableID, username, cb){
            $rootScope.socket.emit('vc:end', {
                    tableID: tableID,
                    sessionID: sessionID,
                    username: username},
                function(message){
                    console.log('end');
                    cb(message);
                });
        },
        /**
         *
         * @param tableID
         * @param cb
         */
        changedVCState: function(cb){
            $rootScope.socket.on('vc:start', function(message){
                console.log("changing vc state");
                cb(message.status);
            });
        },
        getVCState: function(tableID){
            $rootScope.socket.emit('vc:state', {
                tableID: tableID
            });
        },
        changeUserVCState: function(cb){
            $rootScope.socket.on('vc:active', function(message){
               cb(message.status);
            });
        }
    };
}]);