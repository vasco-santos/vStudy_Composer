/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp routing configuration
 */
app.config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    // Set up the States
    $stateProvider
        //main page
        .state('/', {
            url: '/',
            views: {
                main: {
                    templateUrl: 'partials/main.html',
                    controller: 'mainController',
                },
                chatBar:{
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the about display
        .state('about', {
            url: '/about',
            views:{
                main: {
                    templateUrl: 'partials/about.html',
                    controller: 'stateController'
                },
                chatBar:{
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the login display
        .state('login', {
            url: '/login',
            views: {
                main: {
                    templateUrl: 'partials/login.html',
                    controller: 'loginController'
                },
                chatBar:{},
                chatWindow:{}
            }
        })
        //the signup display
        .state('register', {
            url: '/register',
            views: {
                main: {
                    templateUrl: 'partials/register.html',
                    controller: 'registerController'
                },
                chatBar: {},
                chatWindow:{}
            }
        })
        //the user display
        .state('user', {
            url: '/user',
            views: {
                main: {
                    templateUrl: 'partials/userPage.html',
                    controller: 'userController'
                },
                chatBar:{
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the user display
        .state('editUser', {
            url: '/editUser',
            views: {
                main: {
                    templateUrl: 'partials/editUser.html',
                    controller: 'editUserController'
                },
                chatBar:{
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the courses display
        .state('courses', {
            url: '/courses',
            views: {
                main: {
                    templateUrl: 'partials/courses.html',
                    controller: 'coursesController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the course display
        .state('course', {
            url: '/course/{c:.*}',
            views: {
                main: {
                    templateUrl: 'partials/course.html',
                    controller: 'courseController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the subject display
        .state('subject', {
            url: '/subject/{s:.*}',
            views: {
                main: {
                    templateUrl: 'partials/subject.html',
                    controller: 'subjectController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }

        })
        //the subject display
        .state('table', {
            url: '/table/{t:.*}',
            views: {
                main: {
                    templateUrl: 'partials/table.html',
                    controller: 'tableController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/table.html',
                    controller: 'tableChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the Repository Courses display
        .state('repositoryCourses', {
            url: '/repositoryCourses',
            views: {
                main: {
                    templateUrl: 'partials/repositoryCourses.html',
                    controller: 'repositoryCoursesController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the Repository Course display
        .state('repositoryCourse', {
            url: '/repositoryCourse/{rc:.*}',
            views: {
                main: {
                    templateUrl: 'partials/repositoryCourse.html',
                    controller: 'repositoryCourseController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        })
        //the Repository Course display
        .state('shelves', {
            url: '/shelves/{s:.*}',
            views: {
                main: {
                    templateUrl: 'partials/shelves.html',
                    controller: 'shelvesController'
                },
                chatBar: {
                    templateUrl: 'partials/chat/normal.html',
                    controller: 'simpleChatController'
                },
                chatWindow:{
                    templateUrl: 'partials/chat/window.html',
                    controller: 'windowChatController'
                }
            }
        });
});