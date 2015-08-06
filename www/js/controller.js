// JavaScript Document
var schedule_data = [];

angular.module('starter.controllers', [])

.controller('HomeTabCtrl', function($scope) {
	console.log('HomeTabCtrl');
	app.initialize();
	
	//initialize values
	$scope.data = {};
	$scope.data.pickup1 = 0;
	$scope.data.pickup2 = 1;
	$scope.data.pickup3 = 2;
	$scope.data.pickup4 = 3;
	$scope.data.status1 = false;
	$scope.data.status2 = false;
	$scope.data.status3 = false;
	$scope.data.status4 = false;
	
	//change status value
	$scope.changestatus = function(device,status,intensity){
		//alert(device+" "+status+ +intensity)
		app.sendData(device,status,intensity);
	};
})

.controller('settingCTRL', function($scope) {
	
})

.controller('scheduleCTRL', function($scope,$rootScope,$ionicPopup,$ionicModal,popupService,$cordovaDatePicker) {
	//localStorage.setItem("schedule_list","");
	var response;
	$scope.data = {};
	$scope.data.schedulename = "";
	
	$scope.saveschedule = function(name){
		if(name != ""){
			if(schedule_data != ""){
				var hasMatch = false;
				var templist = JSON.stringify(schedule_data);
				templist = JSON.parse(templist);
				for (var index = 0; index < templist.length; index++) {
					if(templist[index].sname == name){
						hasMatch = true;
						break;
					}
				}
			}
			
			if(!hasMatch){
				schedule_data.push({sname:name});
				console.log(schedule_data);
				$scope.data.schedulename = "";
				response = JSON.stringify(schedule_data);
				localStorage.setItem("schedule_list",response); 
				$rootScope.$broadcast('schedule_list',response);
			}
			else{
				popupService.popup("Name already exists");
			}
		}
		else{
			popupService.popup("Please fill all fields");
		}
	}
	
	$rootScope.$on('schedule_list', function(event, args) {
		$scope.response = JSON.parse(args);
	})
	
	if(localStorage.getItem("schedule_list") != ""){
		var response = JSON.parse(localStorage.getItem("schedule_list"));
		for(var i in response)schedule_data.push(response[i]);
		console.log(schedule_data);
		$scope.response = response;
	}
	
	$ionicModal.fromTemplateUrl('tabs/scheduledetailmodal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.scheduledetailmodal = modal;
	});
	
	
	
	$scope.slots = [
      {epochTime: 10800, step: 15, format: 12},
      {epochTime: 54900, step: 1, format: 24}
    ];
	
	 $scope.timePickerCallback = function (val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        console.log('Selected time is : ', val);
      }
    };
	
});