/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * Courses service definition.
 */
app.service('coursesService', [ '$resource', function($resource){
    return $resource('/coursesAPI/courses/:id');
}]);

/**
 * Course service definition.
 */
app.service('getCourse', ['$http', function($http){
    return {
        /**
         * HTTP Get to vStudy server in order to get the list of subjects of a course.
         * @param name course name.
         * @param cb the HTTP Response Message.
         */
        list: function(name, cb){
            $http.get('/coursesAPI/course', {
                params: {
                    name: name
                }
            }).success(function(data, status){
                cb(data);
            }).error(function(){
                cb([]);
            });
        }
    }
}]);

/**
 * Subject service definition.
 */
app.service('getSubject', ['$http', function($http){
    return{
        /**
         * HTTP Get to vStudy server in order to get a subject name by its identifier.
         * @param code subject code.
         * @param cb the HTTP Response Message.
         */
        name: function(code, cb){
            $http.get('/coursesAPI/subjectName', {
                params: { code: code }
            }).success(function(data, status){
                cb(data);
            });
        },
        /**
         * HTTP Get to vStudy server in order to get the information of a subject.
         * @param code subject code.
         * @param cb the HTTP Response Message.
         */
        info: function(code, cb){
            $http.get('/coursesAPI/subjectInfo', {
                params: {code: code}
            }).success(function (data, status) {
                cb(data);
            });
        }
    }
}]);