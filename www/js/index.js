'use strict';

//global uuid id
var global_deviceid = "";

//string to ascii
function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
	   array[i] = string.charCodeAt(i);
	}
	return array.buffer;
}
//ascii to string
function bytesToString(buffer) {
		return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

var battery = {service: "FFE0",level: "2A19",char:"FFE1"};

var app = {
    	initialize: function() {
     	this.bindEvents();
        //detailPage.hidden = true;
    },
	initialize1: function() {
     	this.bindEvents1();
		//detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
		deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
	bindEvents1: function() {
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        sendButton.addEventListener('touchstart', this.sendData, false);
		readButton.addEventListener('touchstart', this.readBatteryState, false);
	},
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
		console.log(JSON.stringify(device));
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
		global_deviceid = device.id;
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function() {
				ble.notify(deviceId,battery.service,battery.char,app.onBatteryLevelChange,app.onError);
				batteryStateButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                app.showDetailPage();
			};
		ble.connect(deviceId,onConnect,app.onError);
	},
    onBatteryLevelChange: function(data) {
        console.log(data);
        var message;
        var a = bytesToString(data);
        batteryState.innerHTML = a;
    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
	sendData: function(event) {
		var data = stringToBytes("hello");
		deviceList.innerHTML = "sending";
		ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
	},
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
	onError: function(reason) {
       // alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
