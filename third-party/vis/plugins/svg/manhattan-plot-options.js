/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 2:02 PM
 */

goog.provide('vis.plugins.svg.ManhattanPlotOptions');

goog.require('vis.ui.TrackVisualizationOptions');

/**
 * @param options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.TrackVisualizationOptions
 */
vis.plugins.svg.ManhattanPlotOptions = function(options, data) {
  vis.ui.TrackVisualizationOptions.apply(this, arguments);
};

goog.inherits(vis.plugins.svg.ManhattanPlotOptions, vis.ui.TrackVisualizationOptions);
