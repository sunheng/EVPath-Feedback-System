(function(){
  var dashboard = angular.module('dashboard', ['evpath_service']);

  dashboard.controller('ImageTilesCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket){
    
    //SAMPLE IMAGES
    $scope.images = [
      {
        'name' : 'number1',
        'src' : 'images/tif1.tif',
        'attributes' : 'attrbute1',
        'borderClass' : ''
      },
      {
        'name' : 'number2',
        'src' : 'images/tif2.tif',
        'attributes' : 'attrbute2',
        'borderClass' : ''
      },
      {
        'name' : 'number3',
        'src' : 'images/tif3.tif',
        'attributes' : 'attrbute3',
        'borderClass' : ''
      },
      {
        'name' : 'added4',
        'src' : 'images/tif3.tif',
        'attributes' : 'attrbuteblah',
        'borderClass' : ''
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

    $scope.markAndNext = function(currentIndex, nextIndex, borderClass) {
      $scope.images[currentIndex].borderClass = borderClass;
      $scope.setCurrentImage(nextIndex);
      var markedObject = {
        currentIndex: currentIndex,
        borderClass: borderClass
      };
      socket.emit('imageMarked', markedObject);
    };

    socket.on('imageMarked', function(data) {
      console.log(data);
      $scope.images[data.currentIndex].borderClass = data.borderClass;
    });

    /* TO DO: PUSH IMAGE ONTO DASHBOARD
    socket.emit('ready', null);
    socket.on('newImage', function(data) {
      console.log('newImage');
      $scope.images.push(data);
    });
    */

  }]);
})();