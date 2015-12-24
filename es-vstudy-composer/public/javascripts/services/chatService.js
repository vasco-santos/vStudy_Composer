/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Authentication service definition
 */
app.service('chatS', ['$http', function($http){
	
	this.currentUser = '';
	
    return{
		setUser: function(username){
			this.currentUser = username;	
		},
		getUser: function(cb){
			cb(this.currentUser);
		}
    }
}]);