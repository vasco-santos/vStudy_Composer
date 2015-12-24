/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Courses Controllers definition
 */
app.controller('coursesController', ['coursesService', '$scope', 'cacheService', function (coursesService, $scope, cacheService) {
    cacheService.setData('page', 'courses');
    $scope.courses = coursesService.query();

    /**
     * Course selected.
     * @param course selected.
     */
    $scope.toCourse = function (course) {
        window.location = "#/course/" + course;
    };
}]);

/**
 * vStudyApp Courses Controllers definition
 */
app.controller('courseController', ['getCourse', 'cacheService', '$location', '$scope', function (getCourse, cacheService, $location, $scope) {
    cacheService.setData('page', 'course');
    var path = $location.path();
    var name = path.slice(8, path.length);

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
        window.location = "#/subject/" + subject;
    };
}]);

/**
 * vStudyApp Courses Controllers definition
 */
app.controller('subjectController', ['tables', 'getSubject', 'cacheService', '$location', '$scope', 'files', function (tables, getSubject, cacheService, $location, $scope, files) {
    cacheService.setData('page', 'subject');
    $scope.availableTables = [];
    $scope.newTable = {name: '', description: ''};
    var path = $location.path();
    var uc = path.slice(9, path.length);

    /**
     * Get Subject information.
     */
    getSubject.info(uc, function(data){
        $scope.courses = data;

        /**
         * Get subject name.
         */
        getSubject.name(uc, function (data) {
            console.log(data);
            $scope.subject = JSON.parse(data);

            /**
             * Get list of tables available for the subject.
             */
            tables.list(uc, function(data){
                $scope.availableTables = data;
            });
        });
    });

    /**
     * Create a table through filling in the form.
     */
    $scope.addTable = function () {
        tables.addTable(uc, $scope.newTable.name, $scope.newTable.description,
            $scope.current_user, function(data){
                //console.log(data);
                //data = data.replace(/\"/g, "");
                //console.log(data);
                files.createGroup(data.replace(/\"/g, ""));
                window.location = "#table/" + data;
            });
    };

    /**
     * User selects a table to join.
     * @param id table identifier.
     */
    $scope.joinTable = function (id) {
        tables.joinTable(id, $scope.current_user, function(data, status){
            if(status == 200){
                window.location = "#table/" + data;
            }
        });
    };
}]);