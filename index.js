/*!
 * tiny-ipc
 * Copyright(c) 2016 xunxky
 * MIT Licensed or UNLICENSE
 */
 

var net = require('net'),
    fs =require('fs');
const util = require('util');
const EventEmitter = require('events');

// going to be extended and  cleaned up later 

var client = function(c,id){
    EventEmitter.call(this);
    var self = this;         
    var data = '';   
    self.id = id ;
    c.on('data',function(d){
        data = data+d;
        var m = data.split("\n");
        var o = null;
        for(var i = 0 ; i < (m.length-1);i++){
            if(m[i]){
                o = JSON.parse(m[i]);
                if(o && o.r){
                    switch(o.r) {
                        case 'global':
                            self.emit('message',o.m,o.f);
                            break;
                        case 'init':
                            self.id = self.id || o.m;
                            self.emit('inited',o.m);
                            break;
                        case 'direct':
                            if(o.t && o.t.indexOf(self.id) != -1 ) {
                                self.emit('message',o.m,o.f);
                            }
                            break;                                 
                    }
                }
            }
        }
        data = m[(m.length-1)];
    });
    this.broadcastMessage = function(m){
        c.write(JSON.stringify({r:'global',m:m,f:self.id})+"\n");
    }
    
    /**
     * @param m message anything
     * @param t targets array
     * */
    this.directMessage = function(m,t){
        c.write(JSON.stringify({r:'direct',m:m,f:self.id ,t:t})+"\n");
    }
};
util.inherits(client,EventEmitter);

var makeServer = function(){
    var i = 0;
    var clients = [];
    var dataQueues = {};
    return function(c){
        i ++;
        var x = i+'';
        clients.push({c:c,x:x});
        dataQueues[x] = '';
        c.on('data',function(d){
            dataQueues[x] += d;                            
            var m = dataQueues[x].split("\n");
            if(m.length>1){ 
                d = m.slice(0,-1).join("\n")+"\n";
                dataQueues[x] = m[m.length-1]+"\n";
                for(var j = 0 ; j < clients.length ; j ++){
                    if(clients[j].x != x){
                        clients[j].c.write(d);
                    }
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
        c.write(JSON.stringify({r:'init',m:x})+"\n");
    }
};        

function decodeOptions(options){    
    if(options !== null && typeof options === 'object'){
        return options;
    } else {
        return {path:options}
    }
}

var IPC = {
	makeHub: function(options){
        options = decodeOptions(options);        
        var master = function(){
            var s = net.createServer(makeServer());
            if(options.path){
                try{
                    fs.unlinkSync(options.path);
                } catch ( e ) {}        
            } 
            s.listen(options);            
        };        
		return new master();		
	},
	getClient: function(options,id){
        options = decodeOptions(options);        
        var c = net.connect(options);
		return new client(c,id);		
	}	
}

module.exports = IPC;
