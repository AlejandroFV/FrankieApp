var last_click_time = new Date().getTime();
var last_clicked_note;
var filesystem = null;
var candidate_to_delete = false;

document.addEventListener('deviceready',onDeviceReady);

function onDeviceReady(){
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	if (window.requestFileSystem) {
		initFileSystem();
	} else {
		swal("Ouch...","Este dispositivo no soporta el API de archivos. La aplicación no funcionará.","error");
	}
}

function initFileSystem(){
	window.requestFileSystem(window.PERSISTENT, 1024, function(fs) {
		filesystem = fs;
		var title = new Date().getTime();
		listFiles();
    }, errorHandler);
}

function listFiles() {
	filesystem.root.getDirectory('/MyNotes/',{create:true},function(dirEntry){
		dirReader = dirEntry.createReader();
		var entries = [];
		var fetchEntries = function() {
			dirReader.readEntries(function(results) {
				if (!results.length) {
					displayEntries(entries.sort().reverse());
				} else {
					entries = entries.concat(results);
					fetchEntries();
				}
			}, errorHandler);
		};
		fetchEntries();
	});
}

function displayEntries(entries) {
	var fileList = $(".collection");
	for (var i = 0; i < entries.length; i++) {
		var li = document.createElement('li');
		li.innerText = entries[i].name.replace('.txt','');
		console.log(entries[i].fullPath);
		li.className = "collection-item";
		li.addEventListener('click',onNoteClick);
		fileList.append(li);
	};
}

$(".collection-item").click(onNoteClick);

$("#delete_note").click(removeNote);

function onNoteClick(e){
	$(".collection-item").css("background-color","#fff");
	var new_click_time = e['timeStamp'];
	var new_clicked_note = $(this); 
	if (new_click_time && new_clicked_note.is(last_clicked_note) && (new_click_time - last_click_time) < 250) {
		$(this).css("background-color","grey");
		viewNote();
    }else{
		$(this).css("background-color","lightgrey");
		candidate_to_delete = true;
    }
    last_clicked_note = new_clicked_note;
    last_click_time = new_click_time;
}

function viewNote() {
    var url = "view.html?title=" + encodeURIComponent(last_clicked_note.html());
    window.location.href = url;
}

function removeNote(){
	if(candidate_to_delete){
		if(confirm("¿Desea borrar esta nota? " + last_clicked_note.html())){
			filesystem.root.getFile('/MyNotes/' + last_clicked_note.html() + '.txt', {}, function(fileEntry) {
				fileEntry.remove(function() {
					alert("Nota eliminado");
				}, errorHandler);
			}, errorHandler);
			last_clicked_note.remove();
			last_clicked_note = null;
			candidate_to_delete = false;
		}
	}
	else{
		swal("¡Hey!","No hay ingún elemento seleccionado para eliminar.","error");
	}
}

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function errorHandler(error) {
	var message = '';
	switch (error.code) {
		case FileError.SECURITY_ERR:
			message = 'Security Error';
			break;
		case FileError.NOT_FOUND_ERR:
			message = 'Not Found Error';
			break;
		case FileError.QUOTA_EXCEEDED_ERR:
			message = 'Quota Exceeded Error';
			break;
		case FileError.INVALID_MODIFICATION_ERR:
			message = 'Invalid Modification Error';
			break;
		case FileError.INVALID_STATE_ERR:
			message = 'Invalid State Error';
			break;
		default:
			message = 'Unknown Error UAY';
			break;
	}
	alert(message);
}
