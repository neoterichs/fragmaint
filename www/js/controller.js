// JavaScript Document
var schedule_data = [];
var schedule_detail_data = [];

angular.module('starter.controllers', [])

.controller('HomeTabCtrl', function($scope) {
	//======================================Initiallize app=================================================
	app.initialize();

	//======================================initialize variables ==============================================================================
	$scope.data = {};
	$scope.data.pickup1 = 1;
	$scope.data.pickup2 = 1;
	$scope.data.pickup3 = 1;
	$scope.data.pickup4 = 1;
	$scope.data.status1 = false;
	$scope.data.status2 = false;
	$scope.data.status3 = false;
	$scope.data.status4 = false;
	
	//=====================================change status value================================================================================
	$scope.changestatus = function(device,status,intensity){
		app.sendData(device,status,intensity);
	};
})

.controller('settingCTRL', function($scope) {
	
})

.controller('scheduleCTRL', function($scope,$rootScope,$ionicPopup,$ionicModal,popupService,$cordovaDatePicker,$stateParams) {
	//localStorage.setItem("schedule_list","");
	//localStorage.setItem("schedule_details_data","");
	var response;
	$scope.data = {};
	$scope.data.schedulename = "";
	
	//===================================================save schedule_name======================================================================
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
	
	//===============================================reload schedule list=========================================================================
	$rootScope.$on('schedule_list', function(event, args) {
		$scope.response = JSON.parse(args);
	})
	
	//==============================================load schedule at first time ==================================================================
	if(localStorage.getItem("schedule_list") != ""){
		var response = JSON.parse(localStorage.getItem("schedule_list"));
		for(var i in response)schedule_data.push(response[i]);
		$scope.response = response;
	}
})

.controller('scheduledetailCTRL', function($scope,$ionicPopup,$ionicModal,popupService,$cordovaDatePicker,$stateParams,$rootScope) {
	
	var time1 = 0;
	var time2 = 0;
	//=============================Initilize variales =============================================================================================
	$scope.user = {};
	$scope.user.device1status = 0;
	$scope.user.device1intensity = 1;
	
	$scope.user.device2status = 0;
	$scope.user.device2intensity = 1;
	
	$scope.user.device3status = 0;
	$scope.user.device3intensity = 1;
	
	$scope.user.device4status = 0;
	$scope.user.device4intensity = 1;
	
	//===============================code for ionic model ===========================================================================================
	$ionicModal.fromTemplateUrl('tabs/scheduledetailmodal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.scheduledetailmodal = modal;
	});
	
	//===============================code for timepicker=============================================================================================
	$scope.slots = [
		{epochTime: 0, step: 1, format: 12},
		{epochTime: 0, step: 1, format: 12}
	];
	console.log();
	$scope.timePickerCallback = function (val) {
		if (typeof (val) === 'undefined'){
			console.log('Time not selected');
		} else {
			time1 = epochParser(val,'time');
			console.log('Selected time is : ',time1);
		}
	};
	$scope.timePickerCallback1 = function (val) {
		if (typeof (val) === 'undefined'){
			console.log('Time not selected');
		} else {
			time2 = epochParser(val,'time');
			console.log('Selected time is 2 : ',time2);
		}
	};
	
	//===============================save schedule detail =================================================================================================
	$scope.savescheduledetail = function(user){
		if(time1 != 0 || time2 != 0){
			var response1 = JSON.stringify(schedule_detail_data);
			response1 = JSON.parse(response1);
			
			if(response1.length > 0){
				var flag = false;
				var pflag = false;
				for(var i in response1){
					if(response1[i].sname == $stateParams.schedulename){
						pflag = true;
						if(response1[i].stime == time1 || response1[i].etime == time2){
							flag = true;
							break;
						}
						else flag = false;
					}
					else{
						if(!pflag)pflag = false;
					}
				}
				
				if(pflag){
					if(!flag){
						schedule_detail_data.push({sname:$stateParams.schedulename,stime:time1,etime:time2,device1:user.device3status});
						var response_data = JSON.stringify(schedule_detail_data);
						console.log(response_data);
						localStorage.setItem("schedule_details_data",response_data);
						$scope.scheduledetailmodal.hide();
						$rootScope.$broadcast('schedule_detail_list',response_data);
					}
					else popupService.popup("Time exists");
				}
				else{
					schedule_detail_data.push({sname:$stateParams.schedulename,stime:time1,etime:time2,device1:user.device3status});
					var response_data = JSON.stringify(schedule_detail_data);
					console.log(response_data);
					localStorage.setItem("schedule_details_data",response_data);
					$scope.scheduledetailmodal.hide();
					$rootScope.$broadcast('schedule_detail_list',response_data);
				}
			}else{
				schedule_detail_data.push({sname:$stateParams.schedulename,stime:time1,etime:time2,device1:user.device3status});
				var response_data = JSON.stringify(schedule_detail_data);
				localStorage.setItem("schedule_details_data",response_data);
				$scope.scheduledetailmodal.hide();
				$rootScope.$broadcast('schedule_detail_list',response_data);
				console.log(response_data);
			}
		}
		else popupService.popup("Please fill all fields");
	};
	
	//===============================reload schedule detail =================================================================================================
	$rootScope.$on('schedule_detail_list', function(event, args) {
		var response = JSON.parse(args);
		var schedule_temppdetail_data = [];
		var flag = false;
		for(var i in response){
			if(response[i].sname == $stateParams.schedulename){
				flag = true;
				schedule_temppdetail_data.push(response[i]);
			}
		}
		if(flag){
			var response1 = JSON.stringify(schedule_temppdetail_data);
			response1 = JSON.parse(response1);
			$scope.response = response1;
		}
		else $scope.response = "N";
	})
	
	//===============================load schedule detail =================================================================================================
	if(localStorage.getItem("schedule_details_data") != ""){
		var flag1 = 1;
		var arraydetail = JSON.stringify(schedule_detail_data);
		arraydetail = JSON.parse(arraydetail);
		
		if(arraydetail.length > 0)flag1 = 0;
		else flag1 = 1;
		
		var response = JSON.parse(localStorage.getItem("schedule_details_data"));
		var schedule_temppdetail_data = [];
		var flag = false;
		for(var i in response){

			if(response[i].sname == $stateParams.schedulename){
				flag = true;
				schedule_temppdetail_data.push(response[i]);
			}
			if(flag1 == 1)schedule_detail_data.push(response[i]);
		}
		
		if(flag){
			var response1 = JSON.stringify(schedule_temppdetail_data);
			response1 = JSON.parse(response1);
			$scope.response = response1;
		}
		else $scope.response = "N";
	}
});

// function to conver miliseconds to time
function prependZero(param) {
	if (String(param).length < 2) {
		return "0" + String(param);
	}
	return param;
}

function epochParser(val, opType) {
	if (val === null) {
		return "00:00";
	} else {
		var meridian = ['AM', 'PM'];

		if (opType === 'time') {
			var hours = parseInt(val / 3600);
			var minutes = (val / 60) % 60;
			var hoursRes = hours > 12 ? (hours - 12) : hours;

			var currentMeridian = meridian[parseInt(hours / 12)];

			return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
		}
	}
}