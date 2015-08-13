'use strict';

//global uuid id
var paired_deviceid = "dfd";
var global_name = "";
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

var app1 = {
    initialize1: function() {
        this.bindEvents1();
    },
    bindEvents1: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton1.addEventListener('touchstart', this.refreshDeviceList, false);
        deviceList1.addEventListener('touchstart', this.connect, false); // assume not scrolling
	},
    onDeviceReady: function() {
        app1.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList1.innerHTML = ''; // empties the list
        // scan for all devices
        ble.scan([], 5, app1.onDiscoverDevice, app1.onError);
    },
    onDiscoverDevice: function(device) {
		console.log(JSON.stringify(device));
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        deviceList1.appendChild(listItem);
		paired_deviceid = device.id;
		global_name = device.name;
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function() {
				app1.refreshDeviceList();
			};
		ble.connect(deviceId,onConnect,app1.onError);
	},
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app1.showMainPage, app1.onError);
    },
	showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
		bletitle.innerHTML = "Choose a peripheral"
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
		bletitle.innerHTML = "Device Control"
		disconnectButton.innerHTML = "Disconnect from "+global_name;
    },
	onError: function(reason) {
       // alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
