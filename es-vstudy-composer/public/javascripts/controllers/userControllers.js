/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

// vStudyApp Controllers definition

app.controller('userController', ['authentication', 'tables', '$location', '$rootScope', '$scope', 'cacheService', function (authentication, tables, $location, $rootScope, $scope, cacheService) {
    cacheService.setData('page', 'user');

    authentication.userSubjects(function(data, status){
        if (status == 200){
            tables.userTables(data, function(data){
                $scope.userCourses = data;
                $scope.userCourses.forEach(function(element) {
                    element.show = true;
                }, this);
            });

            authentication.getGrav($rootScope.current_user, function(data, status){
                if (status == 200){
                    $scope.profPic = "http://www.gravatar.com/avatar/" + md5(data.trim().toLowerCase()) + "?s=200";
                }
                else{
                    $location.path(data);
                }
            });
        }
        else{
            $location.path(data);
        }
    });

    $scope.joinTable = function (id) {
        tables.joinTable(id, $scope.current_user, function(data, status){
            if (status == 200){
                window.location = "#table/" + data;
            }
        });
    };

}]).directive('myUser', function() {
    return {
        template: createTable()
    }
});

var createTable = function(){
    var string = "<div class=\"table\"><h3>{{ table.name }}</h3>  <h4> {{ course.name }}</h4>"
    string += "</div><div class=\"tableinfo\"> <img src=\"../img/members.png\"> <label>{{ table.members.length }} </label>";
    string += "<img style=\"margin-left: 3em;\" src=\"../img/rating.png\"> <label> 0 </label>";
    string += " <button style=\"margin-left: 3em;\" ng-click=\"joinTable(table.id)\"> Enter </button>  </div>";
    return string;
};

app.controller('editUserController', ['authentication', 'getCourse', 'coursesService', 'cacheService', '$location', '$rootScope', '$scope', function (authentication, getCourse, coursesService, cacheService, $location, $rootScope, $scope) {
    cacheService.setData('page', 'editUser');
    var selectedCourse = '';
    $scope.gravemail = '';
    $scope.selectedCourse = false;
    $scope.selectedOptions = {
        name: "Select a course",
        subjects: []
    };

	$scope.updatePrev = function() {
    	$scope.profPic = "http://www.gravatar.com/avatar/" + md5($scope.gravemail.trim().toLowerCase()) + "?s=200";
    }

	authentication.getGrav($rootScope.current_user, function(data, status){
        if (status == 200){
        	$scope.gravemail = data;
            $scope.profPic = "http://www.gravatar.com/avatar/" + md5(data.trim().toLowerCase()) + "?s=200";
        }
        else{
            $location.path(data);
        }
    });

    $scope.courses = coursesService.query();

    authentication.getInfo(function(data){
        $scope.courseName = data;
        authentication.userSubjects(function(data, status){
            $scope.subjects = data;
        });
    });

    $scope.getSubjects = function (selected) {
        $scope.selectedCourse = true;
        selectedCourse = selected;
        getCourse.list(selected.name, function (data) {

            $scope.cadeiras = data.cadeiras;
            $scope.code = data.id;
        });
    };

    $scope.editProfile = function(){
    	authentication.addGrav($scope.user, $scope.gravemail, function(data){
            console.log(data);
        });
        if(selectedCourse)
        {
            authentication.addInfo($scope.user, selectedCourse, function(data){
                console.log(data);
            });
        }
        $location.path('/user');
    };

}]);

app.controller('loginController', ['authentication', '$scope', '$rootScope', '$location', 'cacheService', function (authentication, $scope, $rootScope, $location, cacheService) {
    cacheService.setData('page', 'login');
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function () {
        authentication.login($scope.user, function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = $scope.user.username;
                cacheService.setData('user', data.user);
                $location.path('user');
            }
            else {
                $scope.error_message = data.message;
            }
        });
        console.log($scope.user);
    };
}]);

app.controller('registerController', ['authentication', 'getCourse', '$scope', '$rootScope', '$location', 'cacheService', 'coursesService', function (authentication, getCourse, $scope, $rootScope, $location, cacheService, coursesService) {
    cacheService.setData('page', 'register');
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';
    $scope.cadeiras = [];
    $scope.selectedCourse = false;
    $scope.gravemail = '';
    var selectedCourse = '';

    $scope.selectedOptions = {
        name: "Select a course",
        subjects: []
    };

    $scope.courses = coursesService.query();

    $scope.profPic = "http://www.gravatar.com/avatar/" + md5($scope.gravemail.trim().toLowerCase()) + "?s=200";
    $scope.updatePrev = function() {
    	$scope.profPic = "http://www.gravatar.com/avatar/" + md5($scope.gravemail.trim().toLowerCase()) + "?s=200";
    }

    $scope.getSubjects = function (selected) {
        $scope.selectedCourse = true;
        selectedCourse = selected;
        getCourse.list(selected.name, function (data) {

            $scope.cadeiras = data.cadeiras;
            $scope.code = data.id;
        });
    };

    $scope.register = function () {
        authentication.register($scope.user, function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                authentication.addGrav($scope.user, $scope.gravemail, function(data){
                    console.log(data);
                });
                if(selectedCourse)
                {
                    authentication.addInfo($scope.user, selectedCourse, function(data){
                        console.log(data);
                    });
                }
                cacheService.setData('user', data.user);
                $location.path('/');
            }
            else {
                $scope.error_message = data.message;
            }
        });
    };
}]);