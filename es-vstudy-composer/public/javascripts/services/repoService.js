/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Repository service definition
 */
app.service('getRepository', ['$http', function($http){
    return{
        /**
         * HTTP Get to the vStudy server in order to get the list of files for a subject.
         * @param code subject code.
         * @param cb the list of files as a list.
         */
        listFiles: function(code, cb){
            $http.get('/repositoryAPI/listFiles', {
                params: {code: code}
            }).success(function(data, status){
                cb(data);
            });
        },
        /**
         * HTTP Post to the vStudy server in order to upload a file.
         * @param code subject code.
         * @param username username of the uploader.
         * @param cb the status of the upload operation.
         */
        upload: function(code, username, cb){
            $http.post('/repositoryAPI/uploadFile', {
                'code': code,
                'username': username
            }).success(function(data, status){
                cb(data);
            });
        },
        /**
         * HTTP Get to the vStudy server in order to download a file.
         * @param code subject code.
         * @param username username of the downloader.
         * @param cb the status of the operation, as well as the file content.
         */
        download: function(code, username, cb){
            $http.get('/repositoryAPI/downloadFile', {
                params: {code: code,
                         username: username}
            }).success(function(data, status){
                cb(data);
            });
        }
    }
}]);

