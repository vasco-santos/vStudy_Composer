/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Repository Courses Controllers definition
 */
app.controller('repositoryCoursesController', ['coursesService', '$scope', 'cacheService', function (coursesService, $scope, cacheService) {
    cacheService.setData('page', 'repositoryCourses');

    /**
     * Get courses list.
     * @type {*|{method, isArray}}
     */
    $scope.courses = coursesService.query();

    /**
     * Course selected.
     * @param course selected.
     */
    $scope.toCourse = function (course) {
        window.location = "#/repositoryCourse/" + course;
    };
}]);

/**
 * vStudyApp Repository Course Controllers definition
 */
app.controller('repositoryCourseController', ['getCourse', 'cacheService', '$location', '$scope' , function (getCourse, cacheService, $location, $scope) {
    cacheService.setData('page', 'repositoryCourse');
    var path = $location.path();
    var name = path.slice(18, path.length);

    /**
     * Get list of subjects of the course.
     */
    getCourse.list(name, function (data) {
        $scope.course = data.name;
        $scope.cadeiras = data.cadeiras;
        $scope.code = data.id;
    });

    /**
     * Subject selected.
     * @param subject selected.
     */
    $scope.toSubject = function (subject) {
        window.location = "#/shelves/" + subject;
    };
}]);

/**
 * vStudyApp Repository Shelves Controllers definition
 */
app.controller('shelvesController', ['getRepository', 'getSubject', '$scope', '$location', 'cacheService', 'files', '$sce', 'Upload', '$rootScope',
function (getRepository, getSubject, $scope, $location, cacheService, files,$sce, Upload, $rootScope) {
    cacheService.setData('page', 'shelves');
    var path = $location.path();
    var uc = path.slice(9, path.length);
    var myID = JSON.parse(cacheService.getData('user')).id;
    $scope.files = [];
    /**
     * Get subject name.
     */
    getSubject.name(uc, function (data) {
        $scope.subject = JSON.parse(data);
    });

    // Repository
    $scope.repoFiles = [];
    $scope.repoobjects = [];
    $scope.temporary = "false";

    $scope.$on('$viewContentLoaded', function() {
        $scope.getRepoFiles();  
    });
    
     $scope.getRepoFiles = function(){

        files.getGroupFiles(uc, "false", function(result){
            console.log(result);
            if(result != 'false'){
                for(var j = 0; j < result.length; j++){
                    
                    if($scope.repoobjects){
                    var selected = $scope.repoFiles.filter(function(obj) {
                        return obj.file_name === result[j].file_name;
                    });
                    if(selected.length == 0){
                        $scope.repoFiles.push(result[j]);
                    }
                    }
                }
    
                for(var i = 0; i < $scope.repoFiles.length; i++){
                    console.log($scope.repoFiles[i]);
                    if(!('preview' in $scope.repoFiles[i]))
                        $scope.repoFiles[i].preview = $scope.getRepoFile($scope.repoFiles[i].file_name);
                    
                }
            }
        });
    }
    
    $scope.getRepoFile = function(filename){

        files.get_file(filename, uc, "false", myID, function(result, type, trust, ext, url){
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
    
    $scope.select_repo_file = function(name){
      if($scope.repo_preview){
          $scope.repo_preview.selected = false;
      }

      var selected = $scope.repoobjects.filter(function(obj) {
          return obj.name === name;
      });
           

      $scope.repo_preview =  selected[0];
      $scope.repo_preview.selected = true;
    };
    
    $scope.uploadFiles = function (files) {
        if (files && files.length) {
            // or send them all together for HTML5 browsers:
            Upload.upload({url:"/storageAPI/file", data: {file: files, group: uc,
                temporary: $scope.temporary, member: myID}});
        }
    };

    $scope.uploadFile = function(file){
        console.log($scope.tableID);
        if(myID){
            Upload.upload({url:"/storageAPI/file", data: {file: file, group: uc,
                temporary: $scope.temporary, memberid: myID, filename: file.name}}).then(function (resp) {
                file.status = "Sent - Status " + resp.data;
                $scope.getRepoFiles();
            }, function (resp) {
                console.log('Error status: ' + resp);
            });
        }
        else{
            $scope.err = "Need to complete form";
        }
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
    
}]);