/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/22/2015
 * Time: 3:12 PM
 */

goog.provide('vs.ui.VisHandler');

goog.require('vs.models.DataSource');
goog.require('vs.ui.Setting');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService, threadPool: parallel.ThreadPool}} $ng
 * @param {Object.<string, *>} options
 * @param {vs.models.DataSource} data
 * @constructor
 */
vs.ui.VisHandler = function($ng, options, data) {
  /**
   * @type {angular.Scope}
   * @private
   */
  this._$scope = $ng['$scope'];

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = $ng['$element'];

  /**
   * @type {angular.Attributes}
   * @private
   */
  this._$attrs = $ng['$attrs'];

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $ng['$timeout'];

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = $ng['taskService'];

  /**
   * @type {parallel.ThreadPool}
   * @private
   */
  this._threadPool = $ng['threadPool'];

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = options;

  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = data;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._beginDrawTask = this._taskService.createTask(this.beginDraw, this);

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._endDrawTask = this._taskService.createTask(this.endDraw, this);

  /**
   * @type {Promise}
   * @private
   */
  this._lastDraw = Promise.resolve();

  /**
   * @type {boolean}
   * @private
   */
  this._lastDrawFired = true;

  /**
   * @type {parallel.ThreadProxy}
   * @private
   */
  this._thread = null;

  /**
   * @type {parallel.SharedObject.<vs.models.DataSource>}
   * @private
   */
  this._sharedData = null;

  // Redraw if:

  // Data changed
  /*var self = this;
  var onDataChanged = function() {
    self._threadPool.queue(function(thread) {
      self._thread = thread;
      return thread.swap(self._data.raw(), 'vs.models.DataSource')
        .then(function(d) {
          self._sharedData = d;
        });
    }).then(function() {
      self.draw();
    });
  };
  this._data['changed'].addListener(onDataChanged);

  // Data ready for the first time
  this._data['ready'].then(onDataChanged);*/

  this._data['changed'].addListener(this.draw, this);

  // Data ready for the first time
  var self = this;
  this._data['ready'].then(function() { self.draw(); });

  // Options changed
  this._$scope.$watch(
    function(){ return self._options; },
    function() { self.draw(); },
    true);
};

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.VisHandler.Settings = {
  'margins': vs.ui.Setting.PredefinedSettings['margins'],
  'width': vs.ui.Setting.PredefinedSettings['width'],
  'height': vs.ui.Setting.PredefinedSettings['height']
};

/**
 * @type {string}
 * @name vs.ui.VisHandler#render
 */
vs.ui.VisHandler.prototype.render;

/**
 * Gets a list of all settings (option definitions) for this type of visualization
 * @type {Object.<string, vs.ui.Setting>}
 * @name vs.ui.VisHandler#settings
 */
vs.ui.VisHandler.prototype.settings;

/**
 * @type {angular.Scope}
 * @name vs.ui.VisHandler#$scope
 */
vs.ui.VisHandler.prototype.$scope;

/**
 * @type {jQuery}
 * @name vs.ui.VisHandler#$element
 */
vs.ui.VisHandler.prototype.$element;

/**
 * @type {angular.Attributes}
 * @name vs.ui.VisHandler#$attrs
 */
vs.ui.VisHandler.prototype.$attrs;

/**
 * The values for the visualization predefined settings
 * @type {Object.<string, *>}
 * @name vs.ui.VisHandler#options
 */
vs.ui.VisHandler.prototype.options;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.VisHandler#data
 */
vs.ui.VisHandler.prototype.data;

/**
 * @type {parallel.SharedObject.<vs.models.DataSource>}
 * @name vs.ui.VisHandler#sharedData
 */
vs.ui.VisHandler.prototype.sharedData;

/**
 * @type {parallel.ThreadProxy}
 * @name vs.ui.VisHandler#thread
 */
vs.ui.VisHandler.prototype.thread;

/**
 * @type {vs.async.Task}
 * @name vs.ui.VisHandler#beginDrawTask
 */
vs.ui.VisHandler.prototype.beginDrawTask;

/**
 * @type {vs.async.Task}
 * @name vs.ui.VisHandler#endDrawTask
 */
vs.ui.VisHandler.prototype.endDrawTask;

/**
 * @type {vs.models.Margins}
 * @name vs.ui.VisHandler#margins
 */
vs.ui.VisHandler.prototype.margins;

/**
 * @type {number}
 * @name vs.ui.VisHandler#width
 */
vs.ui.VisHandler.prototype.width;

/**
 * @type {number}
 * @name vs.ui.VisHandler#height
 */
vs.ui.VisHandler.prototype.height;

Object.defineProperties(vs.ui.VisHandler.prototype, {
  'render': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { throw new u.UnimplementedException('Property "render" does not exist in data source'); })},
  'settings': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return vs.ui.VisHandler.Settings; })},
  '$scope': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$scope; })},
  '$element': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$element; })},
  '$attrs': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$attrs; })},
  'options': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._options; })},
  'data': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._data; })},

  'sharedData': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._sharedData; })},
  'thread': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._thread; })},

  'beginDrawTask': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._beginDrawTask; })},
  'endDrawTask': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._endDrawTask; })},

  'margins': {
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.optionValue('margins'); }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { return this._options['margins'] = value; })
  },

  'width': {
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.optionValue('width'); }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { return this._options['width'] = value; })
  },

  'height': {
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.optionValue('height'); }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { return this._options['height'] = value; })
  }
});

/**
 * @param {string} optionKey
 * @returns {*}
 */
vs.ui.VisHandler.prototype.optionValue = function(optionKey) {
  if (!(optionKey in this['settings'])) { return null; }
  return this['settings'][optionKey].getValue(this['options'], this['$attrs'], this['data'], this['settings']);
};

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.beginDraw = function() { /*console.log('Vis.beginDraw'); */return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.endDraw = function() { /*console.log('Vis.endDraw'); */return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.draw = function() {
  var self = this;
  var lastDraw = this._lastDraw;
  if (!this._lastDrawFired) { return lastDraw; }

  this._lastDrawFired = false;
  var promise = new Promise(function(resolve, reject) {
    var taskService = self._taskService;

    // Since we chose to run draw tasks sequentially, there is no need to queue them using promises.
    // The beginDraw and draw must run one after the other, with no delay in between, so this is a temporary fix for that problem.
    // TODO: Create an entirely new chain, containing both the beginDraw and draw tasks and run that instead.
    /*lastDraw
     .then(function() { return taskService.runChain(self['beginDrawTask']); })
     .then(function() { return taskService.runChain(self['endDrawTask']); })
     .then(resolve);*/

    Promise.resolve()
      .then(function() { taskService.runChain(self['beginDrawTask'], true); })
      .then(function() { taskService.runChain(self['endDrawTask'], true); })
      .then(function() { self._lastDrawFired = true; })
      .then(resolve, reject);
  });
  this._lastDraw = promise;
  return promise;
};

/**
 */
vs.ui.VisHandler.prototype.scheduleRedraw = function() {
  // This will trigger an asynchronous angular digest
  this._$timeout.call(null, function() {}, 0);
};
