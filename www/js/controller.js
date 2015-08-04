// JavaScript Document

angular.module('starter.controllers', [])

.controller('HomeTabCtrl', function($scope) {
	console.log('HomeTabCtrl');
	app.initialize();
	$scope.data = {};
	$scope.data.pickup1 = 0;
	$scope.data.pickup2 = 1;
	$scope.data.pickup3 = 2;
	$scope.data.pickup4 = 3;
	
})

.controller('settingCTRL', function($scope) {
	
})

.controller('scheduleCTRL', function($scope) {
	
});