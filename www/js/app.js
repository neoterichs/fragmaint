// JavaScript Document
//var globalip = "192.168.1.34:1837";
var globalip = "50.116.21.72:1837";
var token = "";
angular.module('ionicApp', ['ionic','starter.controllers'])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
   .state('signin', {
      url: "/sign-in",
      templateUrl: "sign-in.html",
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
		  url: "/forgot-password",
		  templateUrl: "forgot-password.html",
		  controller: 'forgotCtrl'
    })
	.state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html",
	  controller: 'menuCtrl'
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
	.state('eventmenu.setting', {
      url: "/setting",
      views: {
        'menuContent' :{
          templateUrl: "templates/setting.html",
		  controller: "setting"
        }
      }
    })
  $urlRouterProvider.otherwise("/sign-in");
})

