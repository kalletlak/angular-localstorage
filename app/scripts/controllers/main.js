'use strict';

/**************
  GUID generator
**************/
 var generateUUID = function() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === 'function'){
        d += window.performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)      {
      /*jslint bitwise: true */
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// Session object prototype
var virtualStudy = {
  id : '',
  color : 'white',
  studyName : 'My virtual study',
  studyPatientMap: [],
  scope:'DEFAULT',
  description:''
};
var sutdySampleMap = {
  studyID : '',
   samples : []
};
/**
 * @ngdoc function
 * @name angularStorageApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularStorageApp
 */
angular.module('angularStorageApp')
 .controller('MainCtrl',  ['$scope','localStorageService', function ($scope,localStorageService) {
    var todosInStore = localStorageService.get('virtualStudies');
    $scope.virtualStudies = todosInStore || [];
    $scope.$watch('virtualStudies', function () {
  	  localStorageService.set('virtualStudies', $scope.virtualStudies);
	}, true);
    $scope.items=[];
    $scope.virtualStudyName = '';
    $scope.virtualStudyDesc = '';
    $scope.virtualStudycolor = '';
    $scope.addCancerStudySamples = function(){
      $scope.items.push({
            cancerStudy: '',
            samplesList: ''
      });
    };

    $scope.deleteList = function (index) {
        $scope.items.splice(index, 1);
    };

    $scope.addVirtualStudy = function () {
      var _virtualStudy = $.extend( true,{}, virtualStudy);
      
      _virtualStudy.id = generateUUID();
      if($scope.virtualStudyName!=''){
        _virtualStudy.studyName = $scope.virtualStudyName;
      }
      if($scope.virtualStudyDesc!=''){
        _virtualStudy.description = $scope.virtualStudyDesc;
      }
      if($scope.virtualStudycolor!=''){
        _virtualStudy.color = $scope.virtualStudycolor;
      }

      $.each($scope.items,function(key,val){
        var _sutdySampleMap = $.extend( true,{}, sutdySampleMap);
        _sutdySampleMap.studyID=val.cancerStudy;
        var samplesList = val.samplesList.split(',');
        _sutdySampleMap.samples=samplesList;
        _virtualStudy.studyPatientMap.push(_sutdySampleMap);
      });
      var jsonData = JSON.stringify(_virtualStudy);
      $scope.virtualStudies.push(jsonData);

      //Initialize fields
      $scope.virtualStudyName = '';
      $scope.virtualStudyDesc = '';
      $scope.virtualStudycolor = '';
      $scope.items=[];
    };
     $scope.removeVirtualStudy = function (index) {
      $scope.virtualStudies.splice(index, 1);
    };
  }]);


