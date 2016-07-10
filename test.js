	var CPUs = require('os').cpus().length,
		cluster = require('cluster'),
		IPC=require('./index.js');


	if (cluster.isMaster ) {
		var hub = IPC.makeHub('/tmp/mysock1');
		for (var i = 0; i < CPUs; i++) { //
			cluster.fork();
		}   
	} else {
		c = IPC.getClient('/tmp/mysock1',process.pid);
		c.on('message',function(o,f){console.log(f);console.log(o);});
        messagecount = 0;
        doMesssage = function() {
            messagecount ++;
            c.broadcastMessage (' test ' + messagecount + ' ' +process.pid);		
        }
        timers = {
            t1 : setInterval(doMesssage,1000),
            t2 : setInterval(doMesssage,1000)
        }        
	}
