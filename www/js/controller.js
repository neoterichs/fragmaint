// JavaScript Document
angular.module('starter.controllers', [])

.controller('HomeTabCtrl', function($scope,ble) {
	console.log('HomeTabCtrl');
	ble.bindEvents();
})

.controller('settingCTRL', function($scope,ble) {
	ble.bindEvents1();
});