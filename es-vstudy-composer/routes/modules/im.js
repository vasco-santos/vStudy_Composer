#!/usr/bin/env node
var operations = { "LOGIN":'0', "SEND_MESSAGE":'2' , "REGISTER_USER": '3', "MULTIUSER": "4", "RMESSAGE":"5","ADD_USER":"6","LOAD_MESSAGES":"7"}



var imservice = function imservice(host,qname){
    var amqp = require('amqplib');
    var when = require('when');
    require('url');

    var host = host;
    var queue_name = qname;
    var lastMessage;

    //Send Message method
    //Receives dict as args
    this.sendMessage = function (operation, args) {
       
        amqp.connect(host).then(function(conn) {
            return when(conn.createChannel().then(function(ch) {

                var q = queue_name;
                var ok = ch.assertQueue(q, {durable: true});

                return ok.then(function() {
                    //var msg = process.argv.slice(2).join(' ') || "Hello World!";
                    var msg = { 'operation' : operations[operation], 'args' : args}
                    ch.sendToQueue(q, new Buffer(JSON.stringify(msg)), {deliveryMode: true});
                    console.log(" [x] Sent '%s'", JSON.stringify(msg));
                    return ch.close();
                });
            })).ensure(function() { conn.close(); });
        }).then(null, console.warn);
    };

    if (imservice.caller != imservice.getInstance){
        throw new Error("This object cannot be instanciated");
    }

    this.listen = function(cb){
        amqp.connect(host).then(function(conn) {
            process.once('SIGINT', function() { conn.close(); });
            return conn.createChannel().then(function(ch) {
                var ok = ch.assertQueue('response_queue', {durable: true});
                ok = ok.then(function() { ch.prefetch(1); });
                ok = ok.then(function() {
                    ch.consume('response_queue', doWork, {noAck: false});
                    console.log(" [*] Waiting for messages. To exit press CTRL+C");
                });
                return ok;

                function doWork(msg) {
                    var body = msg.content.toString();
                    cb(body);
                    ch.ack(msg);
                    /*var body = msg.content.toString();
                    console.log(" [x] Received '%s'", body);
                    //console.log(body);
                    var secs = body.split('.').length - 1;
                    console.log(" [x] Task takes %d seconds", secs);
                    setTimeout(function() {
                        console.log(" [x] Done");
                        ch.ack(msg);
                    }, secs * 1000);*/
                }
            });
        }).then(null, console.warn);
    };

};

imservice.instance = null;

imservice.getInstance = function(){
    if (this.instance === null){
        this.instance = new imservice('amqp://localhost:5672','task_queue');
    }
    return this.instance;
};


module.exports = imservice.getInstance();

//ims = imservice.getInstance();

var loginmessage = {

    "sessionid":"1",
    "username" : "rvicente12345",
    "pass" : "esimservice"
}

var loginmessage2 = {
    "sessionid":"2",
    "username" : "mvicente12345",
    "pass" : "12345678aaa"
}

var registermessage = {
    'sessionid':'1',
    'username':'rvicente12345',
    'pass':'esimservice',
    'fname':'vicente',
    'gname':'reis',
    'nick':'rvi',
    'email':'miguelvicente93@gmail.com'
}

var newmessage = {
    "sessionid":"2",
    "username" : "mvicente12345",
    "room":"banan"
    //"message":"Hello!"
}

var newmessage2  = {
    "sessionid":"1",
    "username" : "rvicente12345",
    "room":"banan"
    //"message":"Hello!"
}

var newmessage3  = {
    "sessionid":"1",
    "room":"banan",
    "message":"Hello!"
}

//ims.sendMessage('LOGIN',loginmessage);
//ims.sendMessage('LOGIN',loginmessage2);

//ims.sendMessage('MULTIUSER',newmessage);
//ims.sendMessage('MULTIUSER',newmessage2);

//ims.sendMessage('RMESSAGE',newmessage3);*/
