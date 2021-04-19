function hexString(byteArray) {
	return Array.prototype.map.call(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join('');
}

function byteArray(hexString) {
	var result = [];
	for (var i = 0; i < hexString.length; i += 2) {
		result.push(parseInt(hexString.substr(i, 2), 16));
	}
	return result;
}

function formatHexString(hexString) {
  return hexString.toUpperCase().match(/.{1,2}/g).join(' ');
}

function unformatHexString(hexString) {
  return hexString.toLowerCase().replace(/\s/g, '');
}