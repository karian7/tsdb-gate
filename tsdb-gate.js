var net = require('net');
var async = require('async');

var buffer = {};
var server = net.createServer(function (c) { //'connection' listener
	var socketData = '';
	c.on('data', function (data) {
		socketData += data;
	});
	c.on('end', function () {
		if (!socketData || socketData == null || socketData.length == 0) {
			return;
		}
		socketData.split('\n').forEach(function (elem) {
			if (elem.length > 0) {
				var bufferKey = elem.replace(/\|/gi, '_').trim(); // clear data
				buffer[bufferKey] = (buffer[elem] || 0) + 1;
			}
		});
	});
});
server.listen(8124, function () { //'listening' listener
	console.log('server bound');
});

setInterval(function () {
	var bufferToServer = buffer;
	buffer = {};

	var keys = Object.keys(bufferToServer);
	if (keys.length == 0) {
		return;
	}
	var ts = parseInt(new Date().getTime() / 1000);
	var client = net.connect({host: 'tsd.daumcorp.com', port: 4242}, function () {
		async.forEach(keys, function (key, callback) {
			//console.log('key: ' + key);
			var keyIter = key.split(':');

			if (keyIter.length != 2) {
				callback();
				return;
			}

			var tags = keyIter[1].split(',');
			var sendingData = ['put', keyIter[0], ts, bufferToServer[key], tags.join(' ')].join(' ') + '\n';
			//console.log(sendingData);

			client.write(sendingData, function () {
				callback();
			});
		}, function () {
			client.end();
		})
	});
}, 2000);

module.exports = buffer;