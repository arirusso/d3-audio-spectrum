function SpectrumAnalyzerView(model, selector) {
  this.model = model;
  this.selector = selector;
  this.height = 500;
  this.initialize();
}

SpectrumAnalyzerView.prototype.initialize = function() {
  this._y = d3.scale.linear()
    .domain([0, this.height])
    .rangeRound([0, this.height]);
  this.color = d3.scale.linear()
    .domain([0, 500])
    .range(["blue", "red"]);
  this.amplitude = d3.scale.linear()
    .domain([0,10])
    .range([0,500]);
  this.createChart();
  this.initializeChart();
}

SpectrumAnalyzerView.prototype._x = function(n) {
  return d3.scale.linear()
    .domain([0, 1])
    .range([0, this.barWidth()])(n);
}

SpectrumAnalyzerView.prototype.barWidth = function() {
  var bands = this.model.data.length || 512
  var curveFactor = ((1024 / bands) - 2)
  return (4096/this.model.resolution) + curveFactor;
}

SpectrumAnalyzerView.prototype.createChart = function() {
  var data = this.model.getInitialData();

  this.chart = d3.select(this.selector).append("svg")
    .attr("class", "chart")
    .attr("width", this.barWidth() * data.length)
    .attr("height", this.height);
}

SpectrumAnalyzerView.prototype.reset = function() {
  d3.select("svg").remove(); 
  this.createChart();
  this.initializeChart();
}

SpectrumAnalyzerView.prototype.initializeChart = function() {
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

SpectrumAnalyzerView.prototype.update = function() {
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

SpectrumAnalyzerView.prototype.enqueueNextUpdate = function() {
  var view = this;
  timeout = setTimeout(function() { view.update() }, 50);
  return timeout;
}
