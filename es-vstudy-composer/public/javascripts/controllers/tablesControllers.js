/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Tables Controllers definition
 */
app.controller('tableController', ['authentication', '$timeout', '$sce', 'imService', 'vcService', 'tables', 'getSubject', 'cacheService', '$location', '$scope', '$rootScope', 'files', 'Upload', function (authentication, $timeout, $sce, imService, vcService, tables, getSubject, cacheService, $location, $scope, $rootScope, files, Upload) {

    cacheService.setData('page', 'table');
    var myID = JSON.parse(cacheService.getData('user')).id;
    var path = $location.path();
    $scope.ws = {video: false, files: false, solutions: false, repository: false, base: true};

    // Table
    $scope.tableID = JSON.parse(path.slice(7, path.length));
    $scope.table = null;

    // Video Conference
    $scope.source = '';
    $scope.peers = [];
    $scope.messages = [];
    $scope.vc = {active: false, participant: false};
    $scope.conferenceType = 'camera';

    // IM
    $scope.newMessage = {text: ''};

    // File Sharing
    $scope.err = "";
    $scope.files = [];
    $scope.temporary = "true";
    $scope.objects = [];
    $scope.tableFiles = [];
    $scope.the_user = $rootScope.current_user;
    var changeFlag = false;

    // Repository
    $scope.repoFiles = [];
    $scope.repoobjects = [];

    /**
     * Controller Start up.
     */
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

        vcService.getVCState($scope.tableID);

        vcService.changedVCState(function(data){
            $scope.vc.active = data;
            console.log($scope.vc);
        });

        vcService.changeUserVCState(function(data){
            $scope.vc.participant = data;
            console.log($scope.vc);
        });
     });

    // Room Events

    /**
     * Subscribe user to Room events.
     */
    $rootScope.socket.emit('subscribe', {tableID: $scope.tableID,
        sessionID: myID,
        username: $scope.current_user});

    // Table Information
    /**
     * Send new table information.
     */
    $rootScope.socket.emit('tableInfo', $scope.tableID, function(data){});

    /**
     * Get table information.
     */
    $rootScope.socket.on('tableInfo', function(table){
        $scope.table = table;
        $scope.table.profPics = {};

        $scope.table.members.forEach(function(entry) {
            authentication.getGrav(entry, function(data, status){
                if (status == 200){
                    $scope.table.profPics[entry] = "http://www.gravatar.com/avatar/" + md5(data.trim().toLowerCase()) + "?s=80";
                }
                else{
                    console.warn("An error occurred while trying to obtain the gravatar.");
                }
            });
        });

        // _id, created_at, created_by, description, [members], name, profPics
        console.log($scope.table);
        if(!$scope.subject)
        {
            getSubject.name($scope.table.subject, function(data){
                $scope.subject = JSON.parse(data);
            });
        }
    });

    // Table Operations
    /**
     * User pretends to remove the table.
     */
    $scope.destroyTable = function () {
        tables.destroyTable($scope.tableID, $scope.current_user, function(data){
            console.log(data);
            window.location = "#/";
        });
    };

    // Videoconference
    /**
     * Register to Video Conference Signalling server.
     */
    initializeVideoConference (myID,
        // Start Video Conference.
        function(id, src) {
            authentication.getUserBySession(id, function(data, status){
                if (status == 200){
                    if(!data) data = "guest";
                    $scope.peers.push({
                        id: id,
                        stream: src,
                        username: data
                    });
                    //if(!$rootScope.$$digest){
                    //    $rootScope.$apply();
                    //}
                }
                else{
                    console.warn("An error occurred while trying to obtain the username from session.");
                }
            });
        },
        // Leave Video Conference.
        function(id) {
            if (myID === id){
                $scope.peers = [];
                $scope.source = "";
            }
            else{
                $scope.peers = $scope.peers.filter(function (p){
                    return p.id !== id;
                });
            }
            if(!$rootScope.$$digest){
                $rootScope.$apply();
            }
            if (myID === id){
                changeFlag = false;
            }
        });

    var activeMedia = function(fn){
        console.log($scope.conferenceType);
        // Get Media ready
        getTheMedia(function(id, src){
            $scope.source = src;
            if(!$rootScope.$$digest){
                $rootScope.$apply();
            }
            fn();
        }, 'microphone', $scope.conferenceType);
    };

    /**
     * Start Video Conference.
     */
    $scope.startVC = function () {
        activeMedia(function(){
        	// Register
	        vcService.start(myID, $scope.tableID, function(data){
	            console.log(data);
	        });
        });
    };

    /**
     * Join VideoConference
     */
    $scope.joinVC = function(){
        activeMedia(function(){
        	// Join
	        vcService.join(myID, $scope.tableID);
	        });
    };

    /**
     * Change VideoConference source
     */
    $scope.changeVC = function(){
        changeFlag = true;
        $scope.disconnectVC();
        function doStuff() {
            if(changeFlag || $scope.vc.participant) {
                setTimeout(doStuff, 750);
                return;
            }
            if(!$scope.vc.active)
                $scope.startVC();
            else
                $scope.joinVC();
        }
        doStuff();
    };

    /**
     * Get local video of the user.
     * @returns {*}
     */
    $scope.getLocalVideo = function(){
        if($scope.source !== "") {
            return $sce.trustAsResourceUrl($scope.source);
        } else {
            return $sce.trustAsResourceUrl("//:0");
        }
    };

    /**
     * Disconnect VideoConference
     */
    $scope.disconnectVC = function(){
        // INFORM SERVER AND ADD PEER
        vcService.end(myID, $scope.tableID, $scope.current_user, function(data){
            console.log(data);
        });
    };


    // Instant Messaging
 /*   $scope.sendMessage = function(){
        imService.send($scope.current_user, $scope.tableID, myID, $scope.newMessage.text,
            function(){

            });
        $scope.newMessage = {text: ''};
    };*/

    // File Storage
    /**
     * Send new table information.
     */
    $rootScope.socket.emit('fileInfo', $scope.tableID, function(data){});

    /**
     * Get table information.
     */
    $rootScope.socket.on('fileInfo', function(files){
        var n_files = JSON.parse(files);
        //$scope.tableFiles = n_files;
        for(var i = 0; i < n_files.length; i++){
            var selected = $scope.tableFiles.filter(function(obj){
               return obj.file_name === n_files[i].file_name; 
            });
            if(selected.length == 0){
                $scope.getFile(n_files[i].file_name);
                $scope.tableFiles.push(n_files[i]);
            }
            
            
        }
    });
    
    
    $scope.getRepoFiles = function(){

        files.getGroupFiles($scope.table.subject, "false", function(result){
            if(result != 'false'){
                for(var j = 0; j < result.length; j++){
                    console.log(result[j].file_name);
                    if($scope.repoobjects){
                    var selected = $scope.repoobjects.filter(function(obj) {
                        return obj.name === result[j].file_name;
                    });
                    if(selected.length == 0){
                        $scope.repoFiles.push(result[j]);
                    }
                    }
                }
    
                for(var i = 0; i < $scope.repoFiles.length; i++){
                    if(!('preview' in $scope.repoFiles[i]))
                        $scope.repoFiles[i].preview = $scope.getRepoFile($scope.repoFiles[i].file_name);
                    var equal = $scope.tableFiles.filter(function(obj){
                    return obj.file_name === $scope.repoFiles[i].file_name; 
                    });
                    if(equal.length > 0){
                        $scope.repoFiles[i].in_table = true;
                    }
                    else{
                        $scope.repoFiles[i].in_table = false;
                    }
                }
            }
        });
    }

   $scope.getRepoFile = function(filename){

        files.get_file(filename, $scope.table.subject, "false", myID, function(result, type, trust, ext, url){
            
            var c;
            if(trust){
                c = $sce.trustAsResourceUrl(result);
            }
            else{
                c = result;
            }
            console.log(c);
            console.log(type);
            $scope.repoobjects.push({
                content : c,
                type :type,
                ext : ext,
                url : $sce.trustAsResourceUrl(url),
                selected : false,
                name: filename
            });
            return true;
            
        });
    };
    

    $scope.$watch('files', function (files) {
        
        if (files != null) {
            if (!angular.isArray(files)) {
                $scope.files = files = [files];
                $scope.filename = files.name;
                return;
            }
            for (var i = files.length - 1; i >= 0; i--) {
                files[i].status = "Waiting for Upload";
            }
            for (var i = files.length - 1; i >= 0; i--) {
                $scope.uploadFile(files[i]);
            }
        }
    });

    $scope.getFile = function(filename){
        files.get_file(filename, $scope.tableID, $scope.temporary, myID, function(result, type, trust, ext, url){
            var c;
            if(trust){
                c = $sce.trustAsResourceUrl(result);
            }
            else{
                c = result;
            }
            console.log(c);
            console.log(type);
            $scope.objects.push({
                content : c,
                type :type,
                ext : ext,
                url : $sce.trustAsResourceUrl(url),
                selected : false,
                name: filename
            });
            return true;
        });
    };

    $scope.uploadFiles = function (files) {
        if (files && files.length) {
            // or send them all together for HTML5 browsers:
            Upload.upload({url:"/storageAPI/file", data: {file: files, group: $scope.tableID,
                temporary: $scope.temporary, member: myID}});
        }
    };

    $scope.uploadFile = function(file){
        console.log($scope.tableID);
        if($scope.tableID && $scope.temporary && myID){
            Upload.upload({url:"/storageAPI/file", data: {file: file, group: $scope.tableID,
                temporary: $scope.temporary, memberid: myID, filename: file.name}}).then(function (resp) {
                file.status = "Sent - Status " + resp.data;
                alert(file.status);
                $rootScope.socket.emit('fileInfo', $scope.tableID, function(data){});
            }, function (resp) {
                console.log('Error status: ' + resp);
            });
        }
        else{
            $scope.err = "Need to complete form";
        }
    };
    
    $scope.publish = function(){
        if($scope.preview){
            files.publishFile($scope.tableID, $scope.preview.name, $scope.table.subject, function(result){
                if(result){
                    alert("Sucessfully uploaded to repository");
                }
                else{
                    alert("Upload to Repository failed");
                }
            });
        }
        else{
            console.log("420 No scope");
        }
    }
        
    
    $scope.select_repo_file = function(name){
      if($scope.repo_preview){
          $scope.repo_preview.selected = false;
      }

      var selected = $scope.repoobjects.filter(function(obj) {
          return obj.name === name;
      });
      
      var show = $scope.repoFiles.filter(function(obj) {
          return obj.file_name === name;
      });
      

      $scope.repo_preview =  selected[0];
      var in_table = show[0].in_table;
      $scope.repo_preview.in_table = in_table;
      $scope.repo_preview.selected = true;
    };
    
    
    $scope.select_file = function(name){
      if($scope.preview){
          $scope.preview.selected = false;
      }
   
      var selected = $scope.objects.filter(function(obj) {
          return obj.name === name;
      });
      console.log(selected);
      $scope.preview =  selected[0];
      $scope.preview.selected = true;
    };

    // Workspace
    $scope.tools = [
        {   img:"img/video.png", name:"Video" },
        {   img:"img/files.png", name:"Files" },
        {   img:"img/solutions.png", name:"Solutions" },
        {   img:"img/shelves.png", name:"Repository" } ];

    $scope.changeWorkspace = function(name){
        if($scope.workspace == name){
            $scope.workspace = "Base";
            $scope.ws.base = true;
        }
        else{
            $scope.workspace = name;
            $scope.ws.base = false;
        }
        switch (name)
        {
            case "Video":
                $scope.ws.video = !$scope.ws.video;
                $scope.ws.files = false; $scope.ws.solutions = false; $scope.ws.repository = false;
                break;
            case "Files":
                $scope.ws.video = false; $scope.ws.solutions = false; $scope.ws.repository = false;
                $scope.ws.files = !$scope.ws.files;
                break;
            case "Solutions":
                $scope.ws.video = false; $scope.ws.files = false; $scope.ws.repository = false;
                $scope.ws.solutions = !$scope.ws.solutions;
                break;
            case "Repository":
                $scope.getRepoFiles();

                $scope.ws.video = false; $scope.ws.files = false; $scope.ws.solutions = false;
                $scope.ws.repository = !$scope.ws.repository;             
                break;
            default:

                break;
        }
    };

    /**
     * User pretends to leave the table.
     */
    $scope.$on('$destroy', function() {
        $scope.peers = [];
        $scope.messages = [];
        $rootScope.socket.emit('unsubscribe', $scope.tableID);
        vcService.end(myID, $scope.tableID, $scope.current_user);
        $rootScope.socket.emit('leaveTable', {tableID: $scope.tableID, username: $scope.current_user, sessionID: myID});
        $timeout(function() {
            //socket.disconnect();
        }, 1);
    });
}])
/**
 * DIRECTIVE FOR FILE PREVIEW RENDERING.
 */
    .directive("fileRender", ['$templateCache', '$compile', '$http', function($templateCache, $compile, $http){
        var getTemplateUrl = function(type)
        {
            if(type === "code"){
                type = "code_img";
            }
            if(type === "pdf"){
                type = "pdfpreview";
            }
            var templateUrl = '../../partials/renderer/'+ type +'render.html';
            return $http.get(templateUrl, {cache: $templateCache});

        };
        var linker = function (scope, element, attrs)
        {
            scope.$watch('data', function(){
                var template = getTemplateUrl(scope.data.type);
                var promise = template.success(function(html) {
                    element.html(html);
                }).then(function (response) {
                    element.replaceWith($compile(element.html())(scope));
                });
            });
        };
        return {
            template: '<div></div>',
            restrict: "E",
            scope: {
                data: '='
            },
            link: linker
        };
    }])
      .directive("filePreview", ['$templateCache', '$compile', '$http', function($templateCache, $compile, $http){
        var getTemplateUrl = function(type)
        {
            console.log(type);
            var templateUrl = '../../partials/renderer/'+ type +'render.html';
            return $http.get(templateUrl, {cache: $templateCache});
             
        };
        var linker = function (scope, element, attrs)
        {
            scope.$watch('data', function(){
                console.log(scope.data);
                if(scope.data){
                var template = getTemplateUrl(scope.data.type);
                var promise = template.success(function(html) {
                    element.html(html);
                }).then(function (response) {
                    element.replaceWith($compile(element.html())(scope));
                    
                });
                }
            });
        };
        return {
            template: '<div></div>',
            restrict: "E",
            scope: {
                data: '='
            },
            link: linker
        };
    }]);
