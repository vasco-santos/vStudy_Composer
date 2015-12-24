/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudy AngularJS Web APP.
 */
var app = angular.module('vStudyApp', [ 'ui.router', 'ngResource', 'ab-base64', 'ngDropdowns', 'hljs', 'pretty-checkable', 'ngFileUpload', '720kb.tooltips']).run(function (authentication, $rootScope, $http, $location, $state, cacheService, storageService, socket) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.socket = socket;
    $rootScope.windowChat = false;

    $rootScope.socket.on('connect', function(){
        console.log('Socket connected');
    });

    // Verify if has previous logged in session available.
    if (cacheService.getData('user') != null) {
        console.log(cacheService.getData('user'));
        // Try to reauthenticate with previous cookie session.
        authentication.reauthenticate(cacheService.getData('user'), function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = JSON.parse(cacheService.getData('user')).username;               
                $state.go(JSON.parse(cacheService.getData('page')));
            }
        });
    }
    else {
        cacheService.setData('page', '/');
        console.log(cacheService.getData('page'));
    }

    /**
     * Signout function.
     */
    $rootScope.signout = function () {
        authentication.signout($rootScope.current_user, function(){
            $rootScope.authenticated = false;
            $rootScope.current_user = '';
            storageService.clearAll();
        });
    };
});

app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);