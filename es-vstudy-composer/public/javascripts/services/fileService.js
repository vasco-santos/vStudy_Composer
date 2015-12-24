app.service('files', ['$http', 'base64', '$window', function($http, $base64, $window){
    return{
        createGroup: function(tableID){
            console.log("creating group");
            $http.post('/storageAPI/groups', {'tableID': tableID}).success(function(data){
                console.log(data);
            });
        },
        publishFile: function(tableID, filename, ucCode, cb){
            $http.post('/storageAPI/publish',
                {'tableID': tableID, 'filename': filename, 'code': ucCode})
                .success(function(data){
                cb(data);
            });
        },
        getGroupFiles: function(identifier, temp, cb){
            $http.post('/storageAPI/groupfiles', {'identifier': identifier, 'temp':temp}).success(function(data){
                cb(data);
            });
        },
        get_file: function(filename, group, temporary, memberid, cb){
            var req = $http.get('/storageAPI/file', {headers: {
                "filename": filename,
                "group": group,
                "temporary": temporary,
                "memberid" : memberid
            }});
            req.then(
                function success(response) {
                    var f_name = response.headers("filename");
                    var spl = f_name.split(/\./);
                    var ext = spl[spl.length-1];
                    var trust = true;
                    var type = getType(ext);
                    var apptype = type + "/" + ext;
                    switch(type){
                        case("audio"):
                            var blob = b64toBlob(response.data, 'audio/'+ ext, 512);
                            var content = URL.createObjectURL(blob);
                            var url = content;
                            break;
                        case("pdf"):
                            var blob = b64toBlob(response.data, 'application/pdf', 512);
                            var content = URL.createObjectURL(blob);
                            var url = content;
                            break;
                        case("video"):
                            var blob = b64toBlob(response.data, 'video/' + ext, 512);
                            var content = URL.createObjectURL(blob);
                            var url = content;
                            break;
                        case("image"):
                            var ext = realExt(ext);
                            var content = "data:image/" + ext + ";base64," + response.data;
                            var blob = b64toBlob(response.data, 'image/' + ext, 512);
                            var url = URL.createObjectURL(blob);
                            break;
                        default:
                            var content = atob(response.data).toString();
                            var blob =  b64toBlob(response.data, "text/plain", 512);
                            var url = URL.createObjectURL(blob);
                            trust=false;
                    }
                    cb(content, type, apptype, trust, url);
                }, function error(response) {
                    console.log("lixou");
                }
            )
        }
    }
}]);

function realExt(ext){
    if(ext == "jpg")
        ext = "jpeg";
    return ext;
}

function getType(ext){
    audio = ["mp3", "ogg", "wav"];
    video = ["mp4", "webm", "ogg"];
    image = ["gif", "png", "jpg"];

    if(audio.indexOf(ext) > -1){
        return "audio";
    }
    else if(video.indexOf(ext) > -1){
        return "video";
    }
    else if(image.indexOf(ext) > -1){
        return "image";
    }
    else if(ext == "pdf"){
        return ext;
    }
    else{
        return "code";
    }
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
