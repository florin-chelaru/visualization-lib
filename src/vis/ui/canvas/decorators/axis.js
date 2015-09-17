/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vis.ui.canvas.decorators.Axis');

goog.require('vis.ui.Decorator');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.Decorator
 */
vis.ui.canvas.decorators.Axis = function($scope, $element, $attrs, $targetElement) {
  vis.ui.Decorator.apply(this, [$scope, $element, $attrs, $targetElement]);

};

goog.inherits(vis.ui.canvas.decorators.Axis, vis.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vis.ui.canvas.decorators.Axis.orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vis.ui.canvas.decorators.Axis.prototype, {
  type: {
    get: function() { return this.scope.type; }
  },

  ticks: {
    get: function () { return this.scope.ticks || 10; }
  }
});

vis.ui.canvas.decorators.Axis.prototype.draw = function() {
  var opts = this.targetOptions;
  if (!opts) { return; }

  var type = this.type;
  var minYMargin = 25;
  var offset = {top:0, bottom:0, left:0, right:0};

  if (type == 'x' && opts.margins.bottom < minYMargin) { offset.bottom = minYMargin - opts.margins.bottom; }

  if (offset.top + offset.bottom + offset.left + offset.right > 0) {
    opts.margins = opts.margins.add(offset);
    return;
  }

  var margins = opts.margins;
  var intCoords = vis.models.Transformer.intCoords();
  var translate = vis.models.Transformer.translate({x: margins.left, y: margins.top}).combine(intCoords);

  var context = this.visualization.pendingCanvas[0].getContext('2d');
  var moveTo = context.__proto__.moveTo;
  var lineTo = context.__proto__.lineTo;

  var scale = opts.scales[type];

  context.strokeStyle = '#000000';
  context.lineWidth = 1;
  context.font = '17px Times New Roman';
  context.fillStyle = '#000000';

  var ticks = scale.ticks(this.ticks);
  var units = ticks.map(scale.tickFormat(this.ticks));

  var maxTextSize = Math.max.apply(null, units.map(function(unit) { return context.measureText(unit).width; }));

  var minXMargin = maxTextSize + 11;
  if (type == 'y' && opts.margins.left < minXMargin) {
    offset.left = minXMargin - opts.margins.left;
    opts.margins = opts.margins.add(offset);
    return;
  }

  // Draw main line
  context.beginPath();
  moveTo.apply(context, intCoords.calcArr({x: opts.origins.x, y: opts.origins.y}));
  switch (type) {
    case 'x': lineTo.apply(context, intCoords.calcArr({x: opts.width - opts.margins.right, y: opts.origins.y})); break;
    case 'y': lineTo.apply(context, intCoords.calcArr({x: opts.origins.x, y: opts.margins.top})); break;
  }

  // Draw ticks
  var x1 = type == 'x' ? scale : function() { return 0; };
  var x2 = type == 'x' ? scale : function() { return -6; };
  var y1 = type == 'y' ? scale : function() { return opts.height - opts.margins.top - opts.margins.bottom; };
  var y2 = type == 'y' ? scale : function() { return opts.height - opts.margins.top - opts.margins.bottom + 6; };

  ticks.forEach(function(tick) {
    moveTo.apply(context, translate.calcArr({x: x1(tick), y: y1(tick)}));
    lineTo.apply(context, translate.calcArr({x: x2(tick), y: y2(tick)}));
  });

  context.stroke();

  // Draw units
  if (type == 'x') {
    context.textAlign = 'center';
    context.textBaseline = 'top';
  } else {
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    translate = translate.combine(vis.models.Transformer.translate({x: -5, y: 0}));
  }

  units.forEach(function(unit) {
    var p = translate.calc({x: x2(unit), y: y2(unit)});
    context.fillText(unit, p.x, p.y);
  });
};
