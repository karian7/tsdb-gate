var net = require('net');
var buffer = {};
var server = net.createServer(function(c) { //'connection' listener
	var socketData = '';
	c.on('data', function(data) {
		socketData += data;
	});
	c.on('end', function() {
		console.log(socketData);
		if (!socketData || socketData == null || socketData.length == 0) {
			return;
		}
		socketData.split('\n').forEach(function() {
				
		});
		
		var client = net.connect({host: 'tsd.daumcorp.com', port: 4242}, function () {
			client.write(socketData);
			client.end();
		});
	});
});
server.listen(8124, function() { //'listening' listener
	console.log('server bound');
});