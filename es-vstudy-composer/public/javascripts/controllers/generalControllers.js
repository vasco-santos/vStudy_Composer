/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Main Controller definition
 */
app.controller('mainController', ['cacheService', function (cacheService) {
    cacheService.setData('page', '/');

}]);

/**
 * vStudyApp State Controller definition
 */
app.controller('stateController', ['$state', 'cacheService', function ($state, cacheService) {
    cacheService.setData('page', $state.current.name);
}]);

app.controller('navigationController', ['authentication', '$scope', '$rootScope', function (authentication, $scope, $rootScope) {
    $rootScope.$watch('authenticated', function() {
	    if($rootScope.authenticated) {
		    authentication.userSubjects(function(data, status){
		        if (status == 200){
		            $scope.navSubjects = data;
		        }
		    });
		}
	});

	$scope.toSubject = function (subject) {
        window.location = "#/subject/" + subject;
    };
}]);