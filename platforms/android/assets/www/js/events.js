function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady () {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    alert("Close application");
    navigator.app.exitApp();
}
