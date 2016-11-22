SA.Analysis.View = function(model, selector) {
  this._amplitude;
  this._chart;
  this._color;
  this._elementWidth;
  this._x;
  this._y;

  this._model = model;
  this._selector = selector;
  this._height = 500;
  this._elementWidth = document.getElementsByTagName("div")["spectrumAnalyzer"].offsetWidth - 2;
  this._initialize();
}

/*
  Reinitialize the view completely, such as when resolution is changed
*/
SA.Analysis.View.prototype.reset = function() {
  d3.select("svg").remove();
  this._createChart();
  this._initializeChart();
}

SA.Analysis.View.prototype.update = function() {
  var view = this;
  var data = this._model.data;

  this._chart.selectAll("rect")
    .data(data)
    .attr("fill", function(d) {
      return view._color(d);
    })
    .attr("x", function(d, i) {
      return view._x(i);
    })
    .attr("y", function(d) {
      return view._height - view._y(d);
    })
    .attr("width", this._barWidth())
    .attr("height", function(d) {
      return view._amplitude(d);
    });

  this._enqueueNextUpdate();
}

SA.Analysis.View.prototype._initialize = function() {
  this._y = d3.scaleLinear()
    .domain([0, this._height])
    .rangeRound([0, this._height]);
  this._color = d3.scaleLinear()
    .domain([0, 500])
    .range(["blue", "red"]);
  this._amplitude = d3.scaleLinear()
    .domain([0,10])
    .range([0,500]);
  this._createChart();
  this._initializeChart();
}

SA.Analysis.View.prototype._x = function(n) {
  return d3.scaleLinear()
    .domain([0, 1])
    .range([0, this._barWidth()])(n);
}

SA.Analysis.View.prototype._barWidth = function() {
  var length = this._model.data.length || this._model.getInitialData().length;
  var dataLength = Math.min(this._model.length(), length);
  return this._elementWidth / dataLength;
}

SA.Analysis.View.prototype._createChart = function() {
  var data = this._model.getInitialData();

  this._chart = d3.select(this._selector).append("svg")
    .attr("class", "chart")
    .attr("width", this._barWidth() * data.length)
    .attr("height", this._height);
}

SA.Analysis.View.prototype._initializeChart = function() {
  var view = this;
  var data = this._model.getInitialData();

  this._chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("fill", "#FFF")
    .attr("x", function(d, i) {
      return view._x(i) - .5;
    })
    .attr("y", function(d) {
      return view._height - view._y(d) - .5;
    })
    .attr("width", this._barWidth())
    .attr("height", function(d) {
      return 0;
    });
}

SA.Analysis.View.prototype._enqueueNextUpdate = function() {
  var view = this;
  timeout = setTimeout(function() {
    view.update();
  }, 50);
  return timeout;
}
