// JavaScript Document
var db;
angular.module('starter.controllers', [])

.controller('HomeTabCtrl', function($scope) {
	console.log('HomeTabCtrl');
	app.initialize();
	$scope.data = {};
	$scope.data.pickup1 = 0;
	$scope.data.pickup2 = 1;
	$scope.data.pickup3 = 2;
	$scope.data.pickup4 = 3;
	
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {	
		//Please place your db file in wwww directory ,here example : projectpath/www/santosh.db
		db = window.sqlitePlugin.openDatabase({name: "fragmaint.db", createFromLocation: 1});
		alert("conncting"); 
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS schedule_table (id integer primary key, schedulename text)');
			tx.executeSql('INSERT INTO schedule_table (schedulename) VALUES ("Schedule_1")');
		});
	}
})

.controller('settingCTRL', function($scope) {
	
})

.controller('scheduleCTRL', function($scope) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM schedule_table',[],querySuccess,errorCB);
	});
	
	function querySuccess(tx,result){
		$.each(result.rows,function(index){
			var row = result.rows.item(index);
			alert(row['schedulename']);
			$('#elist').append('<a class="item">'+row['schedulename']+'</a>');
		});
	}
	function errorCB(err) {
		alert("Error processing SQL: "+err.code);
	}
});