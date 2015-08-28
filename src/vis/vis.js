/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 3:54 PM
 */

goog.provide('vis');

goog.require('vis.Configuration');
goog.require('vis.ui.VisualizationFactory');
goog.require('vis.ui.Visualization');

vis.main = angular.module('vis', []);

vis.main.provider('configuration', function() {
  var self = this;
  self.__proto__ = new vis.Configuration();
  self.$get = function() { return self; };
});

vis.main.factory('visualizationFactory', ['configuration', function(configuration) {
  return new vis.ui.VisualizationFactory(configuration);
}]);

vis.main.directive('visualization', ['visualizationFactory', function(visualizationFactory) {
  return {
    restrict: 'E',
    templateUrl: 'res/templates/visualization.html',
    scope: {
      data: '=inputData'
    },
    controller: function($scope) {

    },
    link: function(scope, element, attrs) {
      scope.handler = visualizationFactory.createNew(scope, element, attrs);

      scope.$watch(function(){return scope.data.dirty;}, function(newValue, oldValue) {
        if (newValue) {
          scope.handler.draw(scope.data);
          scope.data.dirty = false;
        }
      });
      /*
      Same thing:
       scope.$watch('data', function(newValue, oldValue) {
       console.log(JSON.stringify(newValue));
       });
       */
    }
  };
}]);

// TODO: Later
vis.main.directive('vis-input-data', function() {
  return {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
    },
    link: function(scope, element, attrs, visualizationCtrl) {
      //visualizationCtrl.addPane(scope);
    }
  };
});

// TODO: Later
vis.main.directive('vis-options', function() {
  return {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
    },
    link: function(scope, element, attrs, visualizationCtrl) {
      //visualizationCtrl.addPane(scope);
    }
  };
});

vis.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});


