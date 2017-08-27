//Base Listener
'use strict';

function Listener(name, callback) {
	this.name = name;
	this.callback = callback;

	function setName(name) {
        this.name = name;
    }

	function setCallback(callback) {
    	this.callback = callback;
    }
}

module.exports = Listener;
