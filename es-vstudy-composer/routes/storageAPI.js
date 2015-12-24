/**
 * Created by vsantos on 11/21/15.
 */
var express = require('express');
var router = express.Router();
var session = require('./modules/session');
var request = require("request");
var request_json = require('request-json');
var fs = require("fs");
var formidable = require('formidable');
var fsModule = require('./modules/fileStorage');

//var url = 'http://192.168.215.91:3001/api/';
var url = 'http://localhost:3001/api/';

function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

router.route("/file")
    .get(function(req, res){
        var options = {
            url: url + 'files',
            headers:  req.headers,
            responseType: 'arraybuffer; charset=base64'
        };

        function callback(error, response, body) {
            base64_decode(response.body, "cenas");
            var buffer = new Buffer(response.body, 'base64').toString('base64');
            res.setHeader('Content-type', 'arraybuffer; charset=base64');
            res.setHeader('filename', response.request.headers.filename);
            res.write(buffer);
            res.end();
        }
        request(options, callback);
    })
    .post(function(req, res){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var n_fields = {};
            for (var f in fields){
                n_fields[f] = fields[f];
            }
            files.file.fieldname= 'recfile';
            n_fields["file"] = files.file;
            request.post(url+'files').form(n_fields).on('response', function(response){
                res.writeHead(200, {'content-type': 'text/plain'});
                res.end(response.statusCode.toString());
            });
        });
    });

/**
 * Add a new group
 */
router.route("/groups")
    .post(function(req, res){
        console.log("storageAPI");
        console.log(req.body.tableID);
        fsModule.addGroup(req.body.tableID, function(data){
            if(data){
                console.log("group added");
                return res.send(200, true);
            }
            else return res.send(200, false);
        });
    });

/**
 * Remove a group
 */
/*router.route("/group")
    .delete(function(req, res){
        fsModule.removeGroup(req.body.tableID, function(data){
            if(data){
                return res.send(200, true);
            }
            else return res.send(200, false);
        });
    });
*/

/**
 * get files of a group
 */

router.route("/groupfiles")
    /*.delete(function(req, res){
       fsModule.removeGroupFiles(req.body.tableID, function(data){
           if(data){
               return res.send(200, true);
           }
           else return res.send(200, false);
       });
    })*/
    .post(function (req, res){
         fsModule.listGroupFiles(req.body.identifier, req.body.temp, function(data){
             if(data){
                 return res.send(200, data);
             }
             else return res.send(200, false);
         });
    });

/**
 * Add a member to a group
 */
router.route("/members")
    .post(function(req, res){
        fsModule.addMember(req.body.tableID, req.sessionID, function(data){
            if(data){
                return res.send(200, true);
            }
            else return res.send(200, false);
        });
    })
    .get(function(req, res){
        fsModule.checkMemberAccess(req.body.tableID, req.sessionID, function(data){
            if(data){
                return res.send(200, true);
            }
            else return res.send(200, false);
        });
    })
    .delete(function(req, res){
        fsModule.removeMember(req.body.tableID, req.sessionID, function(data){
            if(data){
                return res.send(200, true);
            }
            else return res.send(200, false);
        });
    });

/**
 * Publish a file to Repository.
 */
router.route("/publish")
    .post(function(req, res){
        fsModule.publishFile(req.body.tableID, req.body.filename, req.body.code, function(data){
            if(data){
                return res.send(200, true);
            }
            else return res.send(200, false);
        })
    });
    
router.route("/grab")
    .post(function(req, res){
        fsModule.grabFile(req.body.tableID, req.body.filename, req.body.code, function(data){
            if(data){
                return res.send(200, true);
            }
            else return res.send(200, false);
        })
    });
    


module.exports = router;
