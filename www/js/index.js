'use strict';

//global uuid id
var global_deviceid = "";

//ascii array
function Bytesarray(string) {
	var array = string.split(",");
   	return array.buffer;
}

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
		sendButton1.addEventListener('touchstart', this.sendData1, false);
		sendButton2.addEventListener('touchstart', this.sendData2, false);
		sendButton3.addEventListener('touchstart', this.sendData3, false);
	},
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
		console.log("d");
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
	},
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function() {
				global_deviceid = deviceId;
				ble.notify(deviceId,battery.service,battery.char,app.onBatteryLevelChange,app.onError);
				disconnectButton.dataset.deviceId = deviceId;
                app.showDetailPage();
			};
		ble.connect(deviceId,onConnect,app.onError);
	},
    onBatteryLevelChange: function(data) {
        console.log(data);
        var message;
        var a = bytesToString(data);
        //batteryState.innerHTML = a;
    },
    disconnect: function(event) {
		ble.disconnect(global_deviceid,app.showMainPage,app.onError);
    },
	sendData: function(event) {
		//deviceList.innerHTML = "sending";
		var data = "";
		var x = checkbox1.checked;
		//0x02	0x01	0x00	0x01	0x03	0x0D	0x0A
		//if(x)data = Bytesarray("0x02,0x01,0x01,0x01,0x03,0x0D,0x0A");
		//else data = Bytesarray("0x02,0x01,0x00,0x01,0x03,0x0D,0x0A");
		
		data[0] = 0x02;
		data[1] = 0x01;
		data[2] = 0x01;
		data[3] = 0x01;
		data[4] = 0x03;
		data[5] = 0x0D;
		data[6] = 0x0A;
		
		ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
	},
	sendData1: function(event) {
		var data = "";
		var x = checkbox2.checked;
		if(x)data = stringToBytes("0x020x020x010x010x030x0D0x0A");
		else data = stringToBytes("0x020x020x000x010x030x0D0x0A");
		ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
	},
	sendData2: function(event) {
		var data = "";
		var x = checkbox3.checked;
		if(x)data = stringToBytes("P31\n");
		else data = stringToBytes("P30\n");
		ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
	},
	sendData3: function(event) {
		var data = "";
		var x = checkbox4.checked;
		if(x)data = stringToBytes("P41\n");
		else data = stringToBytes("P40\n");
		ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
	},
    showMainPage: function() {
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
	onError: function(reason) {
       // alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
