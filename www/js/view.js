var queryString = new Array();

var origin_title, origin_content;

document.addEventListener('deviceready',onDeviceReady);

function onDeviceReady(){
	if (queryString.length == 0) {
		if (window.location.search.split('?').length > 1) {
			var params = window.location.search.split('?')[1].split('&');
			for (var i = 0; i < params.length; i++) {
				var key = params[i].split('=')[0];
				var value = decodeURIComponent(params[i].split('=')[1]);
				queryString[key] = value;
			}
		}
	}
	var fileName = queryString["title"];
	showContent(fileName);
}

function showContent(fileName){
	window.requestFileSystem(window.PERSISTENT, 1024, function(filesystem) {
		filesystem.root.getFile('/MyNotes/' + fileName + '.txt', {}, function(fileEntry) {
			fileEntry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					var note_content = $("#note_content");
					var note_title = $("#note_title");
					note_title.focusin();
					note_content.focusin();
					note_title.val(fileName);
					note_content.val(this.result);
					origin_title = '/MyNotes/' + fileName + '.txt';
					origin_content = this.result;
				};
				reader.readAsText(file);
			}, errorHandler);
		}, errorHandler);

	});
}

$('#new_note').submit(function(e){
	e.preventDefault();
	var new_title = $("#note_title").val();
	var new_content = $("#note_content").val();
	saveChanges('/MyNotes/' + new_title + '.txt',new_content);
});

function saveChanges(title, content){
	if(origin_title !== title || origin_content !== content){
		window.requestFileSystem(window.PERSISTENT, 1024, function(filesystem) {
			filesystem.root.getFile(origin_title, {}, function(fileEntry) {
				fileEntry.moveTo(filesystem.root, title);		
				filesystem.root.getFile(title, {}, function(fileEntry) {
					fileEntry.createWriter(function(fileWriter) {
						var fileParts = [content];
						var contentBlob = new Blob(fileParts, {type : 'text/html'});    
						fileWriter.write(contentBlob);
						fileWriter.onwriteend = function(e) { 
							swal("¡Wuju!","Cambios guardados!","success");
							window.location.replace("index.html");
						};
						fileWriter.onerror = function(e) {
							swal("Ño",'¡Ocurrió un error y la nota no pudo ser guardada!',"error");
						};
					}, errorHandler);		
				}, errorHandler);
			}, errorHandler);
		});
	}else{
		window.location.replace("index.html");		
	}
}
