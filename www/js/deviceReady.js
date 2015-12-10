document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	console.log("Device ready");
	var db = window.openDatabase("DAMM", "1.0", "Demo", 1000);

	db.transaction(function(tx) {
		//tx.executeSql('DROP TABLE IF EXISTS phones');
		tx.executeSql('CREATE TABLE IF NOT EXISTS users_table (id integer primary key, user_name varchar, user_password varchar)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS phones (id integer primary key, name_phone varchar, number_phone varchar)');
		window.localStorage.clear();
	});
}