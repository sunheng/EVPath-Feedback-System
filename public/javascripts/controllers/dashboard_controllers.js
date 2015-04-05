(function(){
  var dashboard = angular.module('dashboard', ['evpath_service']);

  dashboard.controller('ImageTilesCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket){
    
    //SAMPLE IMAGES
    $scope.images = [
      {
        name : 'ImageName1',
        src : 'images/tif1.tif',
        attributes : 'sampleAttribute1',
        borderClass : '',
        history: []
      },
      {
        name : 'ImageName2',
        src : 'images/tif2.tif',
        attributes : 'sampleAttribute2',
        borderClass : '',
        history: []
      },
      {
        name : 'ImageName3',
        src : 'images/tif3.tif',
        attributes : 'sampleAttribute3',
        borderClass : '',
        history: []
      },
      {
        name : 'ImageName4',
        src : 'images/tif3.tif',
        attributes : 'sampleAttribute4',
        borderClass : '',
        history: []
      }
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


    $scope.decisionAction = function(currentIndex, nextIndex, decisionString, borderClass, username) {
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
    };

    function addToHistory(currentIndex, changeset) {
      $scope.images[currentIndex].history.unshift(changeset);
      var imageChangeset = {
        currentIndex: currentIndex,
        changeset: changeset
      };
      socket.emit('newChangeset', imageChangeset);
    }

    socket.on('newChangeset', function(data) {
      $scope.images[data.currentIndex].history.unshift(data.changeset);
    });

    function markAndNext(currentIndex, nextIndex, borderClass) {
      $scope.images[currentIndex].borderClass = borderClass;
      $scope.setCurrentImage(nextIndex);
      var markedObject = {
        currentIndex: currentIndex,
        borderClass: borderClass
      };
      socket.emit('imageMarked', markedObject);
    }

    socket.on('imageMarked', function(data) {
      $scope.images[data.currentIndex].borderClass = data.borderClass;
    });

    socket.on('newFile', function(data) {
      data.data.base64_file_buf = 'data:image/jpeg;base64,' + data.data.base64_file_buf;
      $scope.images[0].src = data.data.base64_file_buf;
      console.log(data);
    });

  }]);
})();