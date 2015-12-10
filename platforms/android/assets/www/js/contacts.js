//Global variables
var phones = [];

/*############################
* Call something and the two callbacks
############################*/
function callSomething(number){
	window.plugins.CallNumber.callNumber(onSuccessCall, onErrorCall, number, true);
}

function onSuccessCall(){
	console.log("Succes for call");
}

function onErrorCall(){
	console.log("Error for call");
}

/*############################
* Pick a contact and the two callbacks
############################*/
function pickAContact(){
	navigator.contacts.pickContact(onSuccessPick,onErrorPick);
}

function onSuccessPick(contact){
	var full_number;
	var short_number;
	
	full_number = contact.phoneNumbers[0].value;

	if ( full_number.charAt(0) == "+" ) {
		short_number = full_number.substring(5, full_number.length);
	}else{
		short_number = full_number;
	}

	window.localStorage.setItem(short_number, contact.displayName);

	/*
	var testObject = { 
		'one': 1, 
		'two': 2, 
		'three': 3,
		'other-json': {
			'four': 4,
			'five': 5,
			'six': 6
		}
	};
	console.log('typeof testObject: ' + typeof testObject);
	console.log('testObject properties:');
	for (var prop in testObject) {
	    console.log('  ' + prop + ': ' + testObject[prop]);
	}

	localStorage.setItem('testObject', JSON.stringify(testObject));

	var retrievedObject = localStorage.getItem('testObject');
	console.log('retrievedObject: ', JSON.parse(retrievedObject));
	*/

	refreshList();
}

function onErrorPick(err){
	console.log('Error: ' + err);
}

/*############################
* Aditionals functions
############################*/
function refreshList(){
	var list = $("#contacts-list");
	var len;
	var db = window.openDatabase("DAMM", "1.0", "Demo", 1000);

	list.html("");
	list.append(
		"<li data-role='list-divider'>" +
			"<h3>Contactos</h3>" +
		"</li>"
	);

	var myStorage = window.localStorage;
	var values = [],
	keys = Object.keys(myStorage),
	i = keys.length;

	while( i-- ){
		list.append(
			"<li>" +
				"<h2>" + myStorage.getItem(keys[i]) + "</h2>" +
				"<span>" + keys[i] + "</span>" +
				"<a hreff='#' onclick='callSomething(\""+keys[i]+"\")'"+
				"class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button'"+
				"><i class='zmdi zmdi-phone zmd-2x'></i></a>" +
				"<a href='#' onclick='deletePhoneNumber(\""+keys[i]+"\")'"+
				"class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button'"+
				"><i class='zmdi zmdi-delete zmd-2x'></i></a>" +
			"</li>"
		);
	}
}

function deletePhoneNumber(number){
	//VISTA PARA CONFIRMAR BORRADO DE NÚMERO [PENDIENTE]
	window.localStorage.removeItem(number);
	refreshList();
}

/*############ Vibrate ###########*/
function vibrate(){
	navigator.notification.vibrateWithPattern([0, 200, 300, 200, 50, 200, 50, 250, 150, 250, 300, 200, 300, 200]);
}