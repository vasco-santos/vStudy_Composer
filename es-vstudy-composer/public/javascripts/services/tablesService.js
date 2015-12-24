/**
 Aveiro University
 MIECT - Services Engineering

 @author: Vasco Santos (64191)

 Service Composition for vStudy Application
 */

/**
 * vStudyApp Tables service definition
 */
app.service('tables', ['$http', function($http){
    return{
        /**
         * HTTP Get to the vStudy Server in order to get the current information of the table.
         * @param id table identifier.
         * @param cb the current information of the table.
         */
        getInfo: function(id, cb){
            $http.get('tablesAPI/tableCurrentInfo', {
                params: {tableID: id}
            }).success(function (data, status) {
                cb(data);
            });
        },
        /**
         * HTTP Get to the vStudy Server in order to get all the tables of a subject.
         * @param id subject identifier.
         * @param cb subject tables list.
         */
        list: function(id, cb){
            $http.get('/tablesAPI/allTables', {
                params: {code: id}
            }).success(function (data, status) {
                data.forEach(function (table) {
                    table.id = table._id;
                });
                cb(data);
            });
        },
        /**
         * HTTP Post to the vStudy Server in order to add a new table to a subject.
         * @param uc subject code.
         * @param name table name.
         * @param description table description.
         * @param creator table creator username.
         * @param cb table data.
         */
        addTable: function (uc, name, description, creator, cb) {
            $http.post('tablesAPI/addTable', {
                'uc': uc,
                'name': name,
                'description': description,
                'creator': creator
            }).success(function (data, status) {
                cb(data);
            });
        },
        /**
         * HTTP Get to the vStudy Server in order to join a Table.
         * @param id table identifier.
         * @param username username of the user to join.
         * @param cb table updated information.
         */
        joinTable: function(id, username, cb){
            $http.get('tablesAPI/joinTable', {
                params: {tableID: id, username: username}
            }).success(function (data, status) {
                cb(data, status);
            }).error(function(data, status){
                cb(data, status);
            });
        },
        /**
         * HTTP Get to the vStudy Server in order to leave a Table.
         * @param id table identifier.
         * @param username username of the user to leave the table.
         * @param cb table updated information.
         */
        leaveTable: function(id, username, cb){
            $http.get('tablesAPI/leaveTable', {
                params: {tableID: id, username: username}
            }).success(function (data, status) {
                cb(data);
            });
        },
        /**
         * HTTP Get to the vStudy Server in order to destroy a table.
         * @param id table identifier.
         * @param username username of the user that pretends to destroy the table.
         * @param cb result of the operation.
         */
        destroyTable: function(id, username, cb){
            $http.get('tablesAPI/removeTable', {
                params: {tableID: id, username: username}
            }).success(function (data, status) {
                cb(data);
            });
        },
        /**
         * HTTP Get to the vStudy Server in order to get the available tables of
         * the subjects that are subscribed by a user.
         * @param subjects
         * @param cb
         */
        userTables: function(subjects, cb){
            console.log(subjects.length);
            $http.get('/tablesAPI/userTables', {
                params: {subjects: subjects}
            }).success(function(data, status){
                data.forEach(function(subject){
                    subject.tables.forEach(function(table){
                        table.id = table._id;
                    });
                });
                cb(data);
            }).error(function(){
               cb([]);
            });
        }
    }
}]);

