var http = require("http");
var fs = require("fs");
var express = require("express");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var inputTime;
var inputTime2;
var ok =1;
app.get('/', function(req, res) {
    console.log('get root');
    res.sendFile(__dirname + '/public/index.html');
});
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('add', function(msg) {
        console.log('add: ');
        console.log(msg);
        add(msg.group, msg.value);
        io.emit('update', obj);
    });
    socket.on('sub', function(msg) {
        console.log('sub');
        console.log(msg);
        sub(msg.group, msg.value);
        io.emit('update', obj);
    });
    socket.on('refresh', function(msg) {
        console.log('refresh');
        io.emit('update', obj);
    });
    socket.on('start', function() {
    	if(ok){
    		start();
    		ok=0;	
    	}
        io.emit('update', obj);
    });
    socket.on('reset', function() {
    	ok=1;
        clearInterval(interval);
        clearInterval(interval2);
        obj.gp1 = inputTime2 * 60 * 1000;
        obj.gp2 = inputTime2 * 60 * 1000;
        obj.gp3 = inputTime2 * 60 * 1000;
        obj.gp4 = inputTime2 * 60 * 1000;
    });
    socket.on('time', function(msg) {
        console.log(msg);
        var inputTime = parseInt(msg);
        inputTime2 = parseInt(msg);
        console.log(inputTime);
        console.log(typeof(inputTime));
        obj.gp1 = inputTime * 60 * 1000;
        obj.gp2 = inputTime * 60 * 1000;
        obj.gp3 = inputTime * 60 * 1000;
        obj.gp4 = inputTime * 60 * 1000;
    });

});

var obj = {};


var interval = 0;
var interval2 = 0;

function start() {
    //if (interval > 0) clearInterval(interval);
    interval = setInterval(count, 1000);
    interval2 = setInterval(push, 1000);
}

function count() {
    obj.gp1 -= 1000;
    obj.gp2 -= 1000;
    obj.gp3 -= 1000;
    obj.gp4 -= 1000;
}

function push() {
    io.emit('update', obj);
}

function add(group, time_raw) {
    console.log("group " + group + " add " + time_raw + " minutes");
    var time = time_raw * 1000 * 60;
    if (group == "1") {
        obj.gp1 += time;
    }
    if (group == "2") {
        obj.gp2 += time;
    }
    if (group == "3") {
        obj.gp3 += time;
    }
    if (group == "4") {
        obj.gp4 += time;
    }
}

function sub(group, time_raw) {
    console.log("group " + group + " sub " + time_raw + " minutes");
    var time = time_raw * 1000 * 60;
    if (group == "1") {
        obj.gp1 -= time;
    }
    if (group == "2") {
        obj.gp2 -= time;
    }
    if (group == "3") {
        obj.gp3 -= time;
    }
    if (group == "4") {
        obj.gp4 -= time;
    }
}

//create server on port 8000
http.listen(8000, function() {
    console.log('listening on locahost:8000');
});
