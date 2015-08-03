'use strict';

//global uuid id
var global_deviceid = "";
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

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
		sendButton1.addEventListener('touchstart', this.sendData1, false);
		sendButton2.addEventListener('touchstart', this.sendData2, false);
		sendButton3.addEventListener('touchstart', this.sendData3, false);
		sendButton4.addEventListener('touchstart', this.sendData4, false);
		
		range1.addEventListener('touchstart', this.sendData1, false);
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
		global_name = device.name;
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function() {
				ble.notify(deviceId,battery.service,battery.char,app.onreceiveData,app.onError);
				disconnectButton.dataset.deviceId = deviceId;
                app.showDetailPage();
			};
		ble.connect(deviceId,onConnect,app.onError);
	},
    onreceiveData: function(data) {
        console.log(data);
        var message;
        var a = bytesToString(data);
        batteryState.innerHTML = a;
    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
	sendData1: function(event) {
		var data = ""; 
		var intensity = range1.value;
		var x = checkbox1.checked;
		if(x)data = stringToBytes("210"+intensity+"3DA");
		else data = stringToBytes("211"+intensity+"3DA");
		ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
	},
	sendData2: function(event) {
		var data1 = "";
		var intensity1 = range2.value;
		var x = checkbox2.checked;
		if(x)data1 = stringToBytes("220"+intensity1+"3DA");
		else data1 = stringToBytes("221"+intensity1+"3DA");
		ble.write(global_deviceid,battery.service,battery.char,data1,app.showDetailPage,app.onError);
	},
	sendData3: function(event) {
		var data2 = ""; 
		var intensity2 = range3.value;
		var x = checkbox3.checked;
		if(x)data2 = stringToBytes("230"+intensity2+"3DA");
		else data2 = stringToBytes("231"+intensity2+"3DA");
		ble.write(global_deviceid,battery.service,battery.char,data2,app.showDetailPage,app.onError);
	},
	sendData4: function(event) {
		var data3 = ""; 
		var intensity3 = range4.value;
		var x = checkbox4.checked;
		if(x)data3 = stringToBytes("240"+intensity3+"3DA");
		else data3 = stringToBytes("241"+intensity3+"3DA");
		ble.write(global_deviceid,battery.service,battery.char,data3,app.showDetailPage,app.onError);
	},
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
		bletitle.innerHTML = "Choose a peripheral"
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
		bletitle.innerHTML = "ON/OFF Status"
		disconnectButton.innerHTML = "Disconnect from"+global_name;
    },
	onError: function(reason) {
       // alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
