//Global variables
var number_phones = [];
var name_phones = [];

document.addEventListener('deviceready',onDeviceReady);

function onDeviceReady(){
	number_phones = $("li span");
	for (var i = number_phones.length - 1; i >= 0; i--) {
		number_phones[i] = number_phones[i].innerHTML;
	};
	name_phones = $("li h2");
	for (var i = name_phones.length - 1; i >= 0; i--) {
		name_phones[i] = name_phones[i].innerHTML;
	};
}

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


	//window.localStorage.setItem(short_number, contact.displayName);
	number_phones.push(short_number);
	name_phones.push(contact.displayName);
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

	putContactsTemporal();
}

function putContactsTemporal(){
	var list = $("#contacts-list");
	list.html("");
	list.append(
		"<li data-role='list-divider'>" +
			"<h3>Contactos</h3>" +
		"</li>"
	);
	var len = number_phones.length;
	for (var i = 0; i < len; i++) {
		list.append(
			"<li id='"+i+"'>" +
				"<h2>" + name_phones[i] + "</h2>" +
				"<span>" + number_phones[i] + "</span>" +
				"<div class='ui-grid-a'>" +
					"<div class='ui-block-a'>" +
						"<a hreff='#' onclick='callSomething(\""+number_phones[i]+"\")'"+
						"class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button'"+
						"><i class='zmdi zmdi-phone zmd-2x'></i></a>" +
					"</div>" +
					"<div class='ui-block-b'>" +
						"<a href='#' onclick='deletePhoneNumber(\""+i+"\")'"+
						"class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button'"+
						"><i class='zmdi zmdi-delete zmd-2x'></i></a>" +
					"</div>" +
				"</div>" +
			"</li>"
		);
	}
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
				"<a href='#' onclick='deletePhoneNumber(\""+i+"\")'"+
				"class='ui-btn ui-btn-inline ui-mini waves-effect waves-button waves-effect waves-button'"+
				"><i class='zmdi zmdi-delete zmd-2x'></i></a>" +
			"</li>"
		);
	}
}

function deletePhoneNumber(number){
	//window.localStorage.removeItem(number);
	//refreshList();
	number_phones.splice(number,1);
	name_phones.splice(number,1);
	putContactsTemporal();
}

/*############ Vibrate ###########*/
function vibrate(){
	navigator.notification.vibrateWithPattern([0, 200, 300, 200, 50, 200, 50, 250, 150, 250, 300, 200, 300, 200]);
}