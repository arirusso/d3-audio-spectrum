SA.Analysis.View = function(model, selector) {
  this.model = model;
  this.selector = selector;
  this.height = 500;
  this.elementWidth = (document.getElementsByTagName("div")["spectrumAnalyzer"].offsetWidth - 2)
  this.initialize();
}

SA.Analysis.View.prototype.initialize = function() {
  this._y = d3.scaleLinear()
    .domain([0, this.height])
    .rangeRound([0, this.height]);
  this.color = d3.scaleLinear()
    .domain([0, 500])
    .range(["blue", "red"]);
  this.amplitude = d3.scaleLinear()
    .domain([0,10])
    .range([0,500]);
  this.createChart();
  this.initializeChart();
}

SA.Analysis.View.prototype._x = function(n) {
  return d3.scaleLinear()
    .domain([0, 1])
    .range([0, this.barWidth()])(n);
}

SA.Analysis.View.prototype.barWidth = function() {
  var dataLength = Math.min(this.model.length(), (this.model.data.length || this.model.getInitialData().length));
  return this.elementWidth / dataLength;
}

SA.Analysis.View.prototype.createChart = function() {
  var data = this.model.getInitialData();

  this.chart = d3.select(this.selector).append("svg")
    .attr("class", "chart")
    .attr("width", this.barWidth() * data.length)
    .attr("height", this.height);
}

SA.Analysis.View.prototype.reset = function() {
  d3.select("svg").remove();
  this.createChart();
  this.initializeChart();
}

SA.Analysis.View.prototype.initializeChart = function() {
  var view = this;
  var data = this.model.getInitialData();

  this.chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("fill", "#FFF")
    .attr("x", function(d, i) { return view._x(i) - .5; })
    .attr("y", function(d) { return view.height - view._y(d) - .5; })
    .attr("width", this.barWidth())
    .attr("height", function(d) { return 0; } );
}

SA.Analysis.View.prototype.update = function() {
  var view = this;
  var data = this.model.data;

  this.chart.selectAll("rect")
    .data(data)
    .attr("fill", function(d) { return view.color(d); })
    .attr("x", function(d, i) { return view._x(i); })
    .attr("y", function(d) { return view.height - view._y(d); })
    .attr("width", this.barWidth())
    .attr("height", function(d) { return view.amplitude(d); } );

  this.enqueueNextUpdate()
}

SA.Analysis.View.prototype.enqueueNextUpdate = function() {
  var view = this;
  timeout = setTimeout(function() { view.update() }, 50);
  return timeout;
}
