/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 12:01 PM
 */

goog.provide('vis.directives.Movable');

goog.require('vis.ui.decorators.Decorator');

/**
 * @param $document
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Movable = function($document) {
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'A',
    replace: false,
    transclude: false,
    controller: function($scope) {
      $scope.self = self;
      $scope.$document = $document;
    }
  });
};

goog.inherits(vis.directives.Movable, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.Movable.prototype.link = function($scope, $element, $attrs, controller) {
  $element
    .css({
      position: 'absolute'
    })
    .append('<div class="resize-box resize-show-on-hover"></div>')
    .append('<div class="resize-grab grab-top-left resize-show-on-hover"></div>')
    .append('<div class="resize-grab grab-top-right resize-show-on-hover"></div>')
    .append('<div class="resize-grab grab-bottom-left resize-show-on-hover"></div>')
    .append('<div class="resize-grab grab-bottom-right resize-show-on-hover"></div>');

  var resizing = false;

  function hover() { $element.find('.resize-show-on-hover').css({ visibility: 'visible' }); }
  function unhover() { $element.find('.resize-show-on-hover').css({ visibility: 'hidden' }); }

  $element.hover(hover, unhover);

  var box = new vis.directives.Movable.BoundingBox($element);
  var startX, startY, target;

  function mousedown(event) {
    // Prevent default dragging of selected content
    event.preventDefault();
    resizing = true;
    target = box.getHandler($(this));
    startX = event.pageX - target.left;
    startY = event.pageY - target.top;
    $scope.$document.on('mousemove', mousemove);
    $scope.$document.on('mouseup', mouseup);
    $element.off('mouseenter mouseleave');
  }

  function mousemove(event) {
    var newY = event.pageY - startY;
    var newX = event.pageX - startX;

    target.top = newY;
    target.left = newX;

    box.update(target);

    $element.css({
      top: box.top + 'px',
      left: box.left + 'px',
      width: box.width + 'px',
      height: box.height + 'px'
    });
    $element.trigger($.Event('resize', {top: box.top, left: box.left, width: box.width, height: box.height}));
  }

  function mouseup() {
    $scope.$document.off('mousemove', mousemove);
    $scope.$document.off('mouseup', mouseup);
    $element.hover(hover, unhover);
  }

  $element.find('.resize-grab').on('mousedown', mousedown);
};

/**
 * @param {jQuery} $elem
 * @constructor
 */
vis.directives.Movable.ResizeHandler = function($elem) {
  /**
   * @type {jQuery}
   */
  this.$elem = $elem;
  var rect = $elem[0].getBoundingClientRect();
  this.top = rect.top;
  this.left = rect.left;
  this.width = rect.width;
  this.height = rect.height;
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Movable.ResizeHandler}
 */
vis.directives.Movable.ResizeHandler.topLeft = function($elem) {
  return new vis.directives.Movable.ResizeHandler($elem.find('.grab-top-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Movable.ResizeHandler}
 */
vis.directives.Movable.ResizeHandler.topRight = function($elem) {
  return new vis.directives.Movable.ResizeHandler($elem.find('.grab-top-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Movable.ResizeHandler}
 */
vis.directives.Movable.ResizeHandler.bottomLeft = function($elem) {
  return new vis.directives.Movable.ResizeHandler($elem.find('.grab-bottom-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Movable.ResizeHandler}
 */
vis.directives.Movable.ResizeHandler.bottomRight = function($elem) {
  return new vis.directives.Movable.ResizeHandler($elem.find('.grab-bottom-right'));
};

/**
 * @param {jQuery} $element
 * @constructor
 */
vis.directives.Movable.BoundingBox = function($element) {
  this.topLeft = vis.directives.Movable.ResizeHandler.topLeft($element);
  this.topRight = vis.directives.Movable.ResizeHandler.topRight($element);
  this.bottomLeft = vis.directives.Movable.ResizeHandler.bottomLeft($element);
  this.bottomRight = vis.directives.Movable.ResizeHandler.bottomRight($element);
  this._margin = - this.topLeft.width * 0.5; // This assumes that all handlers are square and of the same size
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Movable.ResizeHandler}
 */
vis.directives.Movable.BoundingBox.prototype.getHandler = function($elem) {
  switch ($elem[0]) {
    case this.topLeft.$elem[0]:
      return this.topLeft;
    case this.bottomLeft.$elem[0]:
      return this.bottomLeft;
    case this.topRight.$elem[0]:
      return this.topRight;
    case this.bottomRight.$elem[0]:
      return this.bottomRight;
    default:
      return null;
  }
};

/**
 * @param {vis.directives.Movable.ResizeHandler} handler
 */
vis.directives.Movable.BoundingBox.prototype.update = function(handler) {
  switch (handler) {
    case this.topLeft:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin);
      this.bottomLeft.left = handler.left;
      this.topRight.top = handler.top;
      break;
    case this.bottomLeft:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin);
      this.topLeft.left = handler.left;
      this.bottomRight.top = handler.top;
      break;
    case this.topRight:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin);
      this.topLeft.top = handler.top;
      this.bottomRight.left = handler.left;
      break;
    case this.bottomRight:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin);
      this.topRight.left = handler.left;
      this.bottomLeft.top = handler.top;
      break;
  }
};

Object.defineProperties(vis.directives.Movable.BoundingBox.prototype, {
  left: {
    get: function() { return this.topLeft.left + this.topLeft.width + this._margin; }
  },
  top: {
    get: function() { return this.topLeft.top + this.topLeft.height + this._margin; }
  },
  width: {
    get: function() {
      return this.topRight.left - this.topLeft.left - this.topLeft.width - 2 * this._margin;
    }
  },
  height: {
    get: function() {
      return this.bottomLeft.top - this.topLeft.top - this.topLeft.height - 2 * this._margin;
    }
  }
});
