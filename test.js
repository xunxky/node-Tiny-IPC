	var CPUs = require('os').cpus().length,
		cluster = require('cluster'),
		IPC=require('./index.js');


	if (cluster.isMaster ) {
		var hub = IPC.makeHub('/tmp/mysock1');
		for (var i = 0; i < CPUs; i++) { //
			cluster.fork();
		}   
	} else {
		c = IPC.getClient('/tmp/mysock1');
		c.on('message',function(o){console.log(o);});
		c.broadcastMessage (' test '+process.pid);		
	}
