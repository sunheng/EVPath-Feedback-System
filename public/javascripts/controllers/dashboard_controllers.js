(function(){
  var dashboard = angular.module('dashboard', ['evpath_service']);

  dashboard.controller('ImageTilesCtrl', ['$scope', 'socket', function($scope, socket){
    
    $scope.images = [
      // {
      //   name : 'ImageName1',
      //   src : 'images/tif1.tif',
      //   attributes : 'sampleAttribute1',
      //   borderClass : '',
      //   history: []
      // },
      // {
      //   name : 'ImageName2',
      //   src : 'images/tif2.tif',
      //   attributes : 'sampleAttribute2',
      //   borderClass : '',
      //   history: []
      // },
      // {
      //   name : 'ImageName3',
      //   src : 'images/tif3.tif',
      //   attributes : 'sampleAttribute3',
      //   borderClass : '',
      //   history: []
      // },
      // {
      //   name : 'ImageName4',
      //   src : 'images/tif3.tif',
      //   attributes : 'sampleAttribute4',
      //   borderClass : '',
      //   history: []
      // }
    ];

    $scope.currentImage = {};
    $scope.currentIndex = 0;
    $scope.nextIndex = 0;
    $scope.prevIndex = 0;

    $scope.setCurrentImage = function(index) {
      $scope.currentImage = $scope.images[index];
      $scope.currentIndex = index;
      $scope.nextIndex = index + 1 == $scope.images.length ? 0 : index + 1;
      $scope.prevIndex = index - 1 < 0 ? $scope.images.length - 1 : index - 1;
    };


    $scope.decisionAction = function(imageName, currentIndex, nextIndex, decisionString, borderClass, username) {
      var date = new Date();
      var dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
      var rowClass;
      if (decisionString === 'Not an Error') {
        rowClass = 'success';
      } else if (decisionString === 'Not Sure') {
        rowClass = 'warning';
      } else {
        rowClass = 'danger';
      }
      var changeset = {
        username: username,
        timestamp: dateString,
        decision: decisionString,
        rowClass: rowClass
      };
      addToHistory(currentIndex, changeset);
      markAndNext(currentIndex, nextIndex, borderClass);
      //Send to the other interfaces
      var decisionObject = {
        imageName: imageName,
        changeset: changeset,
        borderClass: borderClass
      };
      socket.emit('decision', decisionObject);
    };

    function addToHistory(currentIndex, changeset) {
      $scope.images[currentIndex].history.unshift(changeset);
    }

    function markAndNext(currentIndex, nextIndex, borderClass) {
      $scope.images[currentIndex].borderClass = borderClass;
      $scope.setCurrentImage(nextIndex);
    }

    socket.on('decision', function(decisionObject) {
      for (var i = 0; i < $scope.images.length; i++) {
        if ($scope.images[i].name === decisionObject.imageName) {
          $scope.images[i].history.unshift(decisionObject.changeset);
          $scope.images[i].borderClass = decisionObject.borderClass;
          break;
        }
      }
    });

    socket.on('newFile', function(jsonstone) {
      jsonstone.data.base64_file_buf = 'data:image/jpeg;base64,' + jsonstone.data.base64_file_buf;
      $scope.images.push({
        name: jsonstone.data.filename,
        src: jsonstone.data.base64_file_buf,
        attributes : 'Static attributes',
        borderClass : '',
        history: []
      });
      console.log(jsonstone);
    });

  }]);
})();