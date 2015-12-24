/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Authentication service definition
 */
app.service('authentication', ['$http', function($http){
    return{
        /**
         * HTTP Post to vStudy server in order to login the user.
         * @param user user object.
         * @param cb the HTTP Response Message.
         */
        login: function(user, cb){
            $http.post('/authenticationAPI/login', user).success(function(data){
                cb(data);
            });
        },
        /**
         * HTTP Post to vStudy server in order to regist an user.
         * @param user user object.
         * @param cb the HTTP Response Message.
         */
        register: function(user, cb){
            $http.post('/authenticationAPI/signup', user).success(function(data){
                cb(data);
            });
        },
        /**
         * HTTP Post to vStudy server in order to add information to a user.
         * @param user user object.
         * @param course course object with subscribed subjects.
         * @param cb the HTTP Response Message.
         */
        addInfo: function(user, course, cb){
            var subjects = [];
            for (var index in course.subjects){
                subjects.push(parseInt(course.cadeiras[course.subjects[index]-1].code));
            }
            var courseInfo = {
                id: course.id,
                subjects: subjects
            };
            $http.post('/authenticationAPI/addInfo', {
                user: user,
                courseInfo: courseInfo
            }).success(function(data){
                cb(data);
            });
        },
        /**
         * HTTP Post to vStudy server in order to add gravatar email to a user.
         * @param user user object.
         * @param gravemail the gravatar email of the user.
         * @param cb the HTTP Response Message.
         */
        addGrav: function(user, gravemail, cb){
            $http.post('/authenticationAPI/addGrav', {
                user: user,
                gravemail: gravemail
            }).success(function(data){
                cb(data);
            });
        },
        /**
         * HTTP Get to vStudy server in order to get user information.
         * @param cb the HTTP Response Message.
         */
        getGrav: function(user, cb){
            $http.get('/authenticationAPI/getGrav', {
                params: {user: user}
            }).success(function(data, status){
                cb(data, status);
            });
        },
        /**
         * HTTP Get to vStudy server in order to get user by sessionId.
         * @param cb the HTTP Response Message.
         */
        getUserBySession: function(sessionId, cb){
            $http.get('/authenticationAPI/getUserBySession', {
                params: {sessionId: sessionId}
            }).success(function(data, status){
                cb(data, status);
            });
        },
        /**
         * HTTP Get to vStudy server in order to get user information.
         * @param cb the HTTP Response Message.
         */
        getInfo: function(cb){
            $http.get('/authenticationAPI/userInfo')
                .success(function(data, status){
                    cb(data);
                });
        },
        /**
         * HTTP Get to vStudy server in order to get user subscribed subjects.
         * @param cb the HTTP Response Message.
         */
        userSubjects: function(cb){
            $http.get('/authenticationAPI/userSubjects').success(function (data, status){
                var courses = [];
                for (var i = 0; i < data.length; i++){
                    var bool = true;
                    courses.forEach(function(course){
                        if(course.code == data[i].code){
                            bool = false;
                        }
                    });
                    if (bool === true){
                        courses.push(data[i]);
                    }
                }
                cb(courses, status);
            }).error(function(data, status){
                cb(data, status);
            });
        },
        /**
         * HTTP Get to vStudy server in order to signout the user from the app.
         * @param username username of the user.
         * @param cb the HTTP Response Message.
         */
        signout: function(username, cb){
            $http.get('authenticationAPI/signout', {
                params: {username: username}
            }).success(function(data, status){
                cb();
            });
        },
        /**
         * HTTP Post to vStudy server in order to try to reauthenticate an user previous session.
         * @param user username and session ID.
         * @param cb the HTTP Response Message.
         */
        reauthenticate: function(user, cb){
            $http.post('/authenticationAPI/reauthenticate', user).
                success(function (data) {
                    cb(data);
                });
        }
    }
}]);