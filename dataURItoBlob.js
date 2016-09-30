function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	var arrayBuffer = new ArrayBuffer(byteString.length);
	var _ia = new Uint8Array(arrayBuffer);
	for (var i = 0; i < byteString.length; i++) {
		_ia[i] = byteString.charCodeAt(i);
	}
	var dataView = new DataView(arrayBuffer);
	var blob = new Blob([dataView], { type: mimeString });
	return blob;
}