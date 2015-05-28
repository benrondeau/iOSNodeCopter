// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var NodeCopter = angular.module('nodeCopter', ['ionic']);

NodeCopter.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


var copterData = {};

var timeInterval = 500;


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

  var output = document.getElementById('output');
  
  function onSuccess(acceleration) {

    output.innerHTML = 'Acceleration X: ' + acceleration.x + '</br>' +
    'Acceleration Y: ' + acceleration.y + '</br>' +
    'Acceleration Z: ' + acceleration.z + '</br></br></br>';

    copterData = acceleration;

  };

  function onError() {
      alert('Error!');
  };

  navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);

  setInterval(function () {
              navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
            }, timeInterval);

};


NodeCopter.controller('deviceMotion', function($scope, $http) {

  $scope.sendData = function(){
    console.log('sending data...');

    $http.post('http://192.168.1.5:8888/api/start', {}).
      success(function(data, status, headers, config) {
        alert('Success starting copter!')
        
        setInterval(function () {
          $http.post('http://192.168.1.5:8888/api/fly', copterData).
                success(function(data, status, headers, config) {
                  //successS
                }).
                error(function(data, status, headers, config) {
                  alert('error posting data to server after opening connection with /api/start');
                });
        }, timeInterval);

      }).
      error(function(data, status, headers, config) {
        alert('ERROR starting flight');
      });
  }

  $scope.endData = function(){
    console.log('end sending data....');

    $http.post('http://192.168.1.5:8888/api/stop', {}).
      success(function(data, status, headers, config) {
        alert('Success ending flight!');
          $scope.sendData = 'dead';
        }).
        error(function(data, status, headers, config) {
          alert('ERROR ending flight');
        });
  }

});
