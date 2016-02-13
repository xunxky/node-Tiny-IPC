/*!
 * tiny-ipc
 * Copyright(c) 2016 xunxky
 * MIT Licensed
 */
 

var net = require('net'),
    fs =require('fs');
const util = require('util');
const EventEmitter = require('events');

// yea this is still early beta 
// going to be extended and  cleaned up later 
// but it will surfice for most needs 

IPC = {
	makeHub: function(socketpath){
		var master = function(){
			var self = this;
			var i = 0;
			var clients = [];
			try{
				fs.unlinkSync(socketpath);
			} catch ( e ) {}
			var s = net.createServer(function(c){
				i ++;
				var x = i+'';
				clients.push({c:c,x:x});
				c.on('data',function(d){
					for(var j = 0 ; j < clients.length ; j ++){
						if(clients[j].x != x){
							clients[j].c.write(d);
						}
					}
				});
				c.on('error',function(){
					for(var j = 0 ; j < clients.length ; j ++){
						if(clients[j].x == x){
							var me = clients.splice(j,1);							
							break;
						}
					}
				});
			});
			s.listen(socketpath);

		};
		return new master();		
	},
	getClient: function(socketpath){
		var client = function(){
			EventEmitter.call(this);
			var self = this;
			var c = net.connect(socketpath);
			var data ='';
				c.on('data',function(d){
					data = data+d;
					var m = data.split("\n");
					var o = null;
					for(var i = 0 ; i < (m.length-1);i++){
						if(m[i]){
							o = JSON.parse(m[i]);
							if(o && o.r && o.r=='global'){
								self.emit('message',o.m);
							}
						}
					}
					data = m[(m.length-1)];
				});
			this.broadcastMessage = function(m){
				c.write(JSON.stringify({r:'global',m:m})+"\n");
			}
		};
		util.inherits(client,EventEmitter);
		return new client();		
	}	
}

module.exports = IPC;
