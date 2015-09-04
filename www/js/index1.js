'use strict';

//global uuid id
var paired_deviceid = [];
//paired_deviceid.push({deviceid:"E333",devicename:"Windows",p_status:"Y"});
//paired_deviceid.push({deviceid:"E333",devicename:"Iphone",p_status:"Y"});
var global_name = "";
//string to ascii
function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++){
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
		var response1 = JSON.stringify(paired_deviceid);
		response1 = JSON.parse(response1);
		var flag = false;
		if(response1.length > 0){
			for(var i in response1){
				if(response1[i].deviceid == device.id){
					flag = true;
					break;
				}
			}
		}else{
			var listItem = document.createElement('li'),
			html = '<b>' + device.name + '</b><br/>' + 'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' + device.id;
			listItem.dataset.deviceId = device.id;  // TODO
			listItem.dataset.deviceName = device.name;  // TODO
			listItem.innerHTML = html;
			deviceList1.appendChild(listItem);
		}
		
		if(!flag){
			var listItem = document.createElement('li'),
			html = '<b>' + device.name + '</b><br/>' + 'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' + device.id;
			listItem.dataset.deviceId = device.id;  // TODO
			listItem.dataset.deviceName = device.name;  // TODO
			listItem.innerHTML = html;
			deviceList1.appendChild(listItem);
		}
	},
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId;
		var deviceName = e.target.dataset.deviceName;
		var response1 = JSON.stringify(paired_deviceid);
		response1 = JSON.parse(response1);
		var flag = false;
		if(response1.length > 0){
			for(var i in response1){
				if(response1[i].deviceid != deviceId){
					flag = true;
					break;
				}
			}
		}
		else paired_deviceid.push({deviceid:deviceId,devicename:deviceName,p_status:"Y"});
		if(flag)paired_deviceid.push({deviceid:deviceId,devicename:deviceName,p_status:"Y"});
		app1.refreshDeviceList();
		
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
