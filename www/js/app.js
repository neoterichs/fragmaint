angular.module('ionicApp', ['ionic','starter.controllers'])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
		}
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
	.state('tabs.setting', {
      url: "/setting",
      views: {
        'setting-tab': {
          templateUrl: "templates/setting.html",
		  controller: 'settingCTRL'
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
	
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html"
        }
      }
    });

	$urlRouterProvider.otherwise("/tab/home");

})



.service('ble', function($rootScope,$ionicPopup){
	
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
	this.bindEvents = function() {
		refreshDeviceList();
		refreshButton.addEventListener('touchstart',refreshDeviceList(), false);
		deviceList.addEventListener('touchstart',connect(), false); // assume not scrolling
		title.innerHTML  = "bind";
	}
	this.bindEvents1 = function() {
		batteryState.innerHTML = "bind1";
		disconnectButton.addEventListener('touchstart', this.disconnect, false);
		//sendButton.addEventListener('touchstart', this.sendData, false);
		this.disconnect();
		
	}
	
	this.disconnect = function() {
		batteryState.innerHTML = "disconnet";
		ble.disconnect(global_deviceid,app.showMainPage,app.onError);
	}
		
	function refreshDeviceList(){
		title.innerHTML = 'refreshing'; // empties the list
		ble.scan([], 5,onDiscoverDevice(), app.onError);
		
	}
		
	function onDiscoverDevice(device) {
		title.innerHTML  = "discover";
		console.log(JSON.stringify(device));
		var listItem = document.createElement('li'),
			html = '<b>' + device.name + '</b><br/>' +
				'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
				device.id;
		listItem.dataset.deviceId = device.id;  // TODO
		listItem.innerHTML = html;
		deviceList.appendChild(listItem);
	}
		
		function connect(e) {
			title.innerHTML  = "connect";
			var deviceId = e.target.dataset.deviceId,
				onConnect = function() {
					global_deviceid = deviceId;
					ble.notify(deviceId,battery.service,battery.char,app.onBatteryLevelChange,app.onError);
					disconnectButton.dataset.deviceId = deviceId;
					app.showDetailPage();
				};
			ble.connect(deviceId,onConnect,app.onError);
		}
		var app = {
		onBatteryLevelChange: function(data) {
			// receive code
			var data1 = "";
			data1 = bytesToString(data);
			batteryState.innerHTML = data1;
			/*var temp = data.charAt(1);
			var status = data.charAt(2)+""+data.charAt(3);
			if(temp == "1")localStorage.setItem("D1",status);
			if(temp == "2")localStorage.setItem("D2",status);
			if(temp == "3")localStorage.setItem("D3",status);
			if(temp == "4")localStorage.setItem("D4",status);*/
		},
		
		sendData: function(event) {
			var data = "";
			var x = checkbox1.checked;
			if(x)data = stringToBytes("a21113b\n");
			else data = stringToBytes("a21013b\n");
			ble.write(global_deviceid,battery.service,battery.char,data,app.showDetailPage,app.onError);
		},
		
		showMainPage: function() {
		},
		showDetailPage: function() {
			//mainPage.hidden = true;
			//detailPage.hidden = false;
		},
		onError: function(reason) {
		   alert("ERROR: " + reason); // real apps should use notification.alert
		}
	};

})
