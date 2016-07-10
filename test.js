	var CPUs = require('os').cpus().length,
		cluster = require('cluster'),
		IPC=require('./index.js');

    var options = {
        //path : '/tmp/mysock1'
        port: 9988
    };

	if (cluster.isMaster ) {
		var hub = IPC.makeHub(options);
		for (var i = 0; i < CPUs; i++) { //
			cluster.fork();
		}   
	} else {
		c = IPC.getClient(options,process.pid);
		c.on('message',function(o,f){console.log(process.pid + ' > ' +f+ ': ' + o);});
        messagecount = 0;
        doMesssage = function() {
            messagecount ++;
            c.broadcastMessage (' test ' + messagecount + ' ' +process.pid);		
        }
        doMesssage();
        /*
        timers = {
            t1 : setInterval(doMesssage,1000),
            t2 : setInterval(doMesssage,1000)
        }        
        */
	}
