/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 3:54 PM
 */

goog.provide('vs');

goog.require('vs.Configuration');

goog.require('vs.async.TaskService');

goog.require('vs.models.Transformer');

goog.require('vs.ui.VisualizationFactory');
goog.require('vs.ui.VisHandler');
/*
goog.require('vs.ui.svg.SvgVisualization');
*/
goog.require('vs.ui.canvas.CanvasVis');
/*
goog.require('vs.ui.TrackVisualizationOptions');
*/


goog.require('vs.directives.Visualization');
goog.require('vs.directives.Axis');
/*
goog.require('vs.directives.Grid');
*/

goog.require('vs.directives.Window');
goog.require('vs.directives.Movable');
goog.require('vs.directives.Resizable');


vs.main = angular.module('vs', []);

vs.main.provider('configuration', function() {
  var self = this;
  self.__proto__ = new vs.Configuration();
  self.$get = function() { return self; };
});

vs.main.factory('taskService', ['$timeout', '$q', function($timeout, $q) {
  return new vs.async.TaskService($timeout, $q);
}]);

vs.main.factory('visualizationFactory', ['configuration', 'taskService', '$timeout', function(configuration, taskService, $timeout) {
  return new vs.ui.VisualizationFactory(configuration, taskService, $timeout);
}]);

vs.main.directive('visualization', ['visualizationFactory', 'taskService', function(visualizationFactory, taskService) {
  return vs.directives.Directive.createNew('visualization', vs.directives.Visualization, [visualizationFactory, taskService], {restrict: 'C'});
}]);

vs.main.directive('vsWindow', function() {
  return vs.directives.Directive.createNew('vsWindow', vs.directives.Window, null, {restrict: 'C'});
});

vs.main.directive('vsMovable', ['$document', function($document) {
  return vs.directives.Directive.createNew('vsMovable', vs.directives.Movable, [$document], {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsResizable', ['$document', function($document) {
  return vs.directives.Directive.createNew('vsResizable', vs.directives.Resizable, [$document], {restrict: 'C', require: 'vsWindow'});
}]);


vs.main.directive('vsAxis', ['taskService', '$timeout', function(taskService, $timeout) {
  return vs.directives.Directive.createNew('vsAxis', vs.directives.Axis, [taskService, $timeout], {restrict: 'C', require: '^visualization'});
}]);
/*
vs.main.directive('vsGrid', function() {
  return vs.directives.Directive.createNew('vsGrid', vs.directives.Grid, null, {restrict: 'E', require: '^visualization'/!*, transclude: true*!/});
});
*/


/*
// TODO: Later
vs.main.directive('vs-input-data', function() {
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
vs.main.directive('vs-options', function() {
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
*/

vs.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});

vs.main.run(['$timeout', function($timeout) {
  // u.Event.TIMEOUT = $timeout;
}]);

