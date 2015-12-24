var mongoose = require('mongoose');
var Table = mongoose.model('Table');
var im = require('./modules/im');
var videoconference = require('./modules/videoconference');
var fsModule = require('./modules/fileStorage');
var session = require('./modules/session');

module.exports = function (app, server) {

    // Start web sockets
    app.io = require('socket.io').listen(server, {log: false});

    // Ad-Hoc Middleware
    /*app.io.use(function(socket, next){
        var joinServerParameters = JSON.parse(socket.handshake.query.joinServerParameters);
        console.log(joinServerParameters.user);
        next();
        return;
    });*/

    // start listen with socket.io
    app.io.sockets.on('connection', function(socket){
        console.log('new connected');

        // ROOM SETUP

        socket.on('subscribe', function(data){
            console.log('joining room', data.tableID);
            /**
             * Join Table Group
             */
            socket.join(data.tableID);
            /**

            /**
             * Log in to Instant Messaging Server
             */
            im.sendMessage('ADD_USER',{
                //username: 'mvicente12345',
                username: data.username,
                room: data.tableID,
                sessionid: data.sessionID
            });



            im.sendMessage('LOAD_MESSAGES',{
                lastMessage : "0",
                room: data.tableID,
                sessionid: data.sessionID,
                chatType: "chatroom"
            })

            /**
             * Add Peer availability for the VideoConference Session
             */
            videoconference.addPeer(data.tableID, data.username, data.sessionID);
        });


        socket.on('login', function(data){
            /**
             * Join Self Group
             */
            console.log("LOGIN");
            console.log(data.sessionID);
            socket.join(data.sessionID);
        });


        socket.on('unsubscribe', function(room) {
            console.log('leaving room', room);
            socket.leave(room);
        });

        // TABLE REAL TIME INFORMATION

        socket.on('tableInfo', function(tableID){
            Table.getTableInfo(tableID, function (err, table) {
                if (!err) {
                    app.io.sockets.in(tableID).emit('tableInfo', table);
                }
            })
        });

        socket.on('fileInfo', function(tableID){
            fsModule.listGroupFiles(tableID, "true", function(data){
                if(data){
                    app.io.sockets.in(tableID).emit('fileInfo', data);
                }
            });
        });

        /**
         * Remove user from a table.
         */
        socket.on('leaveTable', function(data){
            console.log("leave1: " + data);
            Table.leaveTable(data.tableID, data.username, function (err, table) {
                if (!err) {
                    /*if(table['members'].length == 0){
                        Table.removeTable(req.param('tableID'), function (err, removed) {
                            if (!err) {
                                fsModule.removeGroupFiles(req.param('tableID'), function(data){
                                    if(data){
                                        fsModule.removeGroup(req.param('tableID'), function(data){
                                            if(data){
                                                // VICENTE CENAS
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else{
                        // Remove Member
                    }*/
                    fsModule.removeMember(data.tableID, data.sessionID, function(data){
                        if (data){
                            app.io.sockets.in(data.tableID).emit('tableInfo', table);
                        }
                    });
                }
            });
        });

        // INSTANT MESSAGING

        im.listen(function(data){
            console.log("Listening RabbitMQ...");

            var received = JSON.parse(data);
            switch(received.eventtype){
                case "LOGIN":

                    break;
                case "SEND_MESSAGE":

                    break;
                case "REGISTER_USER":

                    break;
                case "MULTIUSER":

                    break;
                case "roommessage":
                    //console.log(received.message);
                    //console.log(received.from);
                    //console.log(received.to);
                    app.io.sockets.in(received.to).emit('message:new',
                        {username: received.from,
                            text: received.message});
                    break;
                case "previous":
                    console.log("Message received:" + received.message);
                    console.log("From: "+ received.from);
                    console.log("Message received:" + JSON.parse(received.message));
                    console.log("From: "+ JSON.parse(received.from));
                    console.log("SESSION ID " + received.sessionid);
                    app.io.sockets.in(received.sessionid).emit('message:loadedMessages',
                        {  username : received.from,
                           text : received.message
                       });
                default:
                    break;
            }
        });

        // Success!  Now listen to messages to be received
        socket.on('message:new', function(data){
            console.log('new message: ' + data.text);
            console.log('tableID:' + data.tableID);

            im.sendMessage('RMESSAGE', {
                sessionid: data.sessionID,
                room: data.tableID,
                timestamp: new Date().toJSON(),
                message: data.text
            });
        });
        
        // Get current online users
        socket.on('chat:users', function(){
            console.log(session.getUsernames());
            app.io.sockets.emit('chat:users', session.getUsernames());
        });


        // VIDEOCONFERENCE
        socket.on('vc:start', function(data){
            videoconference.startTableVC(data.tableID, data.sessionID, function(data){
                if(data){
                    socket.emit('vc:active', {status: true});
                    app.io.sockets.in(data.tableID).emit('vc:start', {status: true});
                }
            });
        });

        socket.on('vc:state', function(data){
            console.log("getting state");
            videoconference.vcHappening(data.tableID, function(data){
                console.log(data);
                if(data){
                    socket.emit('vc:start', {status: true});
                }
            });
        });

        socket.on('vc:join', function(data){
            videoconference.addToVC(data.tableID, data.sessionID, function(data){
                if(data){
                    socket.emit('vc:active', {status: true});
                }
            });
        });

        socket.on('vc:end', function(data){
            console.log("disconnecting1");
            videoconference.disconnectFromVC(data.tableID, data.sessionID, data.username, function(data){
                if(data){
                    console.log(data);
                    socket.emit('vc:active', {status: false});
                }
                else{
                    console.log("ending data");
                    console.log(data);
                    socket.emit('vc:active', {status: false});
                    app.io.sockets.in(data.tableID).emit('vc:start', {status: false});
                }
            });
        });

        socket.on('disconnect',function(){
            console.log('User has disconnected');
        });
    });

    /**
     * Attach socket.io
     */
    //app.io.attach(server);
};
