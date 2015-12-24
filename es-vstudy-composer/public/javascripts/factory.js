/**
Aveiro University
MIECT - Services Engineering
    
    @author: Vasco Santos (64191)

Service Composition for vStudy Application
*/

/**
 * vStudyApp factories definition
 */

/**
 * Store information in browser's Web Storage.
 */
app.factory('storageService', function ($rootScope) {
    return {
        get: function (key) {
           return localStorage.getItem(key);
        },
        save: function (key, data) {
           localStorage.setItem(key, JSON.stringify(data));
        },
        remove: function (key) {
            localStorage.removeItem(key);
        },
        clearAll : function () {
            localStorage.clear();
        }
    };
});

/**
 * Middle Layer Cache Service.
 */
app.factory('cacheService', function ($http, storageService) {
    return {
        getData: function (key) {
            return storageService.get(key);
        },
        setData: function (key,data) {
            storageService.save(key, data);
        },
        removeData: function (key) {
            storageService.remove(key);
        }
    };
});

/**
 * Socket Layer Service
 */
app.factory('socket', function ($rootScope) {

    //var joinServerParameters = { user: "xxx"};
    var socket = io.connect('https://192.168.8.217:4230', {'force new connection': true});
    //var socket = io.connect('https://localhost:3000', {'force new connection': true});
    //var socket = io({query: 'joinServerParameters=' + JSON.stringify(joinServerParameters)  });
    return {
        /*connect: function(joinServerParameters, cb){
            //socket.connect();
            socket = io({query: 'joinServerParameters=' + JSON.stringify(joinServerParameters)  });
            cb();
        },*/
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        disconnect: function(){
            socket.disconnect();
        },
        removeAllListeners: function(){
            socket.removeAllListeners(function() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }
    };
});
