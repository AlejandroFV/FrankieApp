$('#new_note').submit(function(e){
	e.preventDefault();
	var title = $("#note_title").val();
	var content = $("#note_content").val();
	saveNote('/MyNotes/' + title + '.txt',content);
});

function saveNote(title, content){
	window.requestFileSystem(window.PERSISTENT, 1024, function(filesystem) {
		filesystem.root.getFile(title, {create: true}, function(fileEntry) {
			fileEntry.createWriter(function(fileWriter) {
				var fileParts = [content];
				var contentBlob = new Blob(fileParts, {type : 'text/html'});    
				fileWriter.write(contentBlob);
				fileWriter.onwriteend = function(e) { 
					swal("Wuju!","Nota guardada","success");
					window.location.replace("index.html");
				};
				fileWriter.onerror = function(e) {
					swal("Ño",'¡Ocurrió un error y la nota no pudo ser guardada!',"error");
				};
			}, errorHandler);
		}, errorHandler);
	});

	var len = number_phones.length;
	var elements = {
		phones: {

		}
	}

	for (var i = 0; i < len; i++) {
		var phone = number_phones[i];
		var name = name_phones[i];
		elements.phones[phone] = [name];
	}

	window.localStorage.setItem(title, JSON.stringify(elements));

	number_phones = [];
	name_phones = [];

}