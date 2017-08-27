/* [keithma 26/8/20017] index.js

This is a timer app running based on nodejs
*/

'use strict';

//Dependencies
var http = require("http");
var fs = require("fs");
var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SocketioUtils = require("./SocketioUtils");
var Listener = require("./listener");

var clientTimer;
var serverTimer;

var isStarting = false;

var obj = {};

var serverInterval = 0;
var clientInterval = 0;

//Time Constants
var oneSecond = 1000;
var sixty = 60

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});



//Listeners
var addListener = new Listener("add", function(msg) {
    add(msg);
    io.emit('update', obj);
});

var subListener = new Listener("sub", function(msg) {
    sub(msg);
    io.emit("update", obj);
})

var refreshListener = new Listener("refresh", function(msg) {
    io.emit("update", obj);
})


/*
Socket.io functions

1. add
2. sub
3. refresh
4. start
5. reset
6. time
7. update

*/

io.on('connection', function(socket) {

    SocketioUtils.setSocket(socket);

    SocketioUtils.setListener(addListener);
    SocketioUtils.setListener(subListener);
    SocketioUtils.setListener(refreshListener);
    // SocketioUtils.setListener("start");
    // SocketioUtils.setListener("reset");
    // SocketioUtils.setListener("time");

 

    socket.on('start', function() {

        if (!isStarting) {
            start();
            isStarting = true;
        }

        io.emit('update', obj);
    });

    socket.on('reset', function() {
        isStarting = false;

        clearInterval(serverInterval);
        clearInterval(clientInterval);

        obj.gp1 = serverTimer * 60 * 1000;
        obj.gp2 = serverTimer * 60 * 1000;
        obj.gp3 = serverTimer * 60 * 1000;
        obj.gp4 = serverTimer * 60 * 1000;
    });

    socket.on('time', function(msg) {

        clientTimer = parseInt(msg);
        serverTimer = parseInt(msg);

        obj.gp1 = clientTimer * 60 * 1000;
        obj.gp2 = clientTimer * 60 * 1000;
        obj.gp3 = clientTimer * 60 * 1000;
        obj.gp4 = clientTimer * 60 * 1000;
    });

});



function start() {
    serverInterval = setInterval(count, 1000);
    clientInterval = setInterval(push, 1000);
}

function count() {
    Object.keys(obj).forEach(function(group) {
        obj[group] -= 1000;
        console.log(obj)
    })
}

function push() {
    io.emit('update', obj);
}

function add(msg) {

    var time = msg.value * 1000 * 60;
    obj["gp"+msg.group] += time;

}

function sub(msg) {
    console.log(msg)
    var time = msg.value * 1000 * 60;
    obj["gp"+msg.group] -= time;
}

//Create server on port 8000
http.listen(8000, function() {
    console.log('Node-timer running on locahost:8000');
});
