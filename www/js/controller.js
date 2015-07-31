// JavaScript Document
angular.module('starter.controllers', [])

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
  app.initialize();
})

.controller('settingCTRL', function($scope) {
	var device1 = localStorage.getItem("D1");
	var device2 = localStorage.getItem("D2");
	var device3 = localStorage.getItem("D3");
	var device4 = localStorage.getItem("D4");
	
  	if(device1 != null){
		var onoffstatus = device1.charAt(0);
		var intensity = device1.charAt(1);
		
		if(onoffstatus){checkbox1.checked = true;}
		else checkbox1.checked = false;
	}
	if(device2 != null){
		var onoffstatus = device2.charAt(0);
		var intensity = device2.charAt(1);
		
		if(onoffstatus){checkbox2.checked = true;}
		else checkbox2.checked = false;
	}
	if(device3 != null){
		var onoffstatus = device3.charAt(0);
		var intensity = device3.charAt(1);
		
		if(onoffstatus){checkbox3.checked = true;}
		else checkbox3.checked = false;
	}
	if(device4 != null){
		var onoffstatus = device4.charAt(0);
		var intensity = device4.charAt(1);
		
		if(onoffstatus){checkbox4.checked = true;}
		else checkbox4.checked = false;
	}
  	
	app.initialize1();
	console.log('settingCTRL');
});