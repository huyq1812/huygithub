var app = angular.module('myApp', [
  'btford.socket-io'
]);
app.factory('mySocket', function(socketFactory) {
  var myIoSocket = io.connect('/webapp');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
});
app.controller('myCtrl', function($scope, mySocket){
  $scope.gtKC = 0;
  $scope.CamBienKC = "Chưa được cập nhật";
  $scope.gtMua = 1;
  $scope.CamBienMua = "Chưa được cập nhật";
  $scope.gtGas = 0;
  $scope.CamBienGas = "Chưa được cập nhật";
  $scope.CamBienND = "Chưa được cập nhật";
  $scope.CamBienDA = "Chưa được cập nhật";
  $scope.leds_status = [1, 1]
  $scope.lcd = ["", ""]

    $scope.updateSensor  = function() {
  		mySocket.emit("SENSOR")
  	}

    $scope.changeLED = function() {
  		console.log("send RELAY ", $scope.leds_status)

  		var json = {
  			"relay": $scope.leds_status
  		}
  		mySocket.emit("RELAY", json)
  	}

    $scope.updateLED = function(value, index) {
        console.log("send RELAY ", $scope.leds_status)

		$scope.leds_status[index] = value == 1 ? 0 : 1;

        $scope.changeLED();
    }

    $scope.updateLCD = function() {


  		var json = {
  			"line": $scope.lcd
  		}
  		console.log("LCD_PRINT ", $scope.lcd)
  		mySocket.emit("LCD_PRINT", json)
  	}


    mySocket.on('SENSOR', function(json) {
    	$scope.gtKC = json.distanceValue
		$scope.CamBienKC = (json.distanceValue == 1) ? "Không có người!" : "Có người nhé!"
		$scope.gtMua = json.mua
		$scope.CamBienMua = (json.mua == 1) ? "Khong có mưa!" : "Có mưa nhé!"
		$scope.gtGas = json.gas
		$scope.CamBienGas = (json.gas == 0) ? "An toàn!" : "Nguy hiểm có khi gas!"
		$scope.CamBienND = json.temp + " độ C"
		$scope.CamBienDA = json.humidity + " %"
	})

	mySocket.on('RELAY_STATUS', function(json) {

		console.log("recv RELAY", json)
		$scope.leds_status = json.data
	})




	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("SENSOR")


	})

});
