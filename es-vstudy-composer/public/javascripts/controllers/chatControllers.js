/**
 * Created by vsantos on 11/30/15.
 */

app.controller('simpleChatController', ['$rootScope', '$scope', 'cacheService', 'chatS', function ($rootScope, $scope, cacheService, chatS) {
    if($rootScope.current_user){
        var myID = JSON.parse(cacheService.getData('user')).id;
        $rootScope.socket.emit('login', {sessionID: myID}); 
        console.log("chat a pintar");
        
        // Get current online users
        $rootScope.socket.on('chat:users', function(message){
            console.log(message);
            $scope.users = message;
        });
        $rootScope.socket.emit('chat:users'); 

        $scope.startchat = function(username){
            console.log(username);
            chatS.setUser(username);
            $rootScope.windowChat = true;
        }
    }
}]);

app.controller('tableChatController', ['$rootScope','$scope','imService','$location','cacheService', function ($rootScope,$scope,imService,$location,cacheService) {

    if($rootScope.current_user){
        var path = $location.path();
        var myID = JSON.parse(cacheService.getData('user')).id;
        
        $rootScope.socket.emit('login', {sessionID: myID}); 
        console.log("table chat a pintar");
        
        // Get current online users
        $rootScope.socket.on('chat:users', function(message){
            console.log(message);
            $scope.users = message;
        });
        $rootScope.socket.emit('chat:users'); 
        
        // Table
        $scope.tableID = JSON.parse(path.slice(7, path.length));
        $scope.table = null;
    
        // IM
        $scope.newMessage = {text: ''};
        $scope.messages = [];
        
        $scope.$on('$viewContentLoaded', function() {

            imService.listenMessage(function(message){
                console.log(message);
                $scope.messages.push(message);
                console.log($scope.messages);
            });
            imService.listenLoadedMessages(function(message){    
                texts = JSON.parse(message.text);
                users = JSON.parse(message.username);
    
                for(i = 0; i<texts.length; i++){
                    var m = {"text":texts[i],
                            "username":users[i]};
                    $scope.messages.push(m);
                }
                console.log($scope.messages);
            });
        });
        
        // Instant Messaging
        $scope.sendMessage = function(){
            imService.send($scope.current_user, $scope.tableID, myID, $scope.newMessage.text,
                function(){
    
                });
            $scope.newMessage = {text: ''};
        };
    }
}]);

app.controller('windowChatController', ['$rootScope', 'cacheService', 'chatS', function ($rootScope, cacheService, chatS) {
    if($rootScope.current_user){
        console.log("window chat a pintar");
        
        $rootScope.$watch('windowChat', function(){
            if($rootScope.windowChat){
                console.log("zauza");
                // Ask chat mesages with user
                // chatS.getUser();
            }
        })        
    }
    // Button to close window
    // $rootScope.windowChat = false;
}]);
