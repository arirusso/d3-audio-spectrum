function SpectrumAnalyzerView(model, selector) {
  this.model = model;
  this.selector = selector;
  this.width = 2;
  this.height = 500;
  this.initialize();
}

SpectrumAnalyzerView.prototype.initialize = function() {
  var view = this;
  var startData = []
  for (var i = 0; i < 512; i++) { startData.push(1); };
  this._y = d3.scale.linear()
    .domain([0, this.height])
    .rangeRound([0, this.height]);
  this._x = d3.scale.linear()
    .domain([0, 1])
    .range([0, this.width]);
  this.chart = d3.select(this.selector).append("svg")
    .attr("class", "chart")
    .attr("width", this.width * startData.length)
    .attr("height", this.height);
  this.chart.selectAll("rect")
    .data(startData)
    .enter().append("rect")
    .attr("fill", "#FFF")
    .attr("x", function(d, i) { return view._x(i) - .5; })
    .attr("y", function(d) { return view.height - view._y(d) - .5; })
    .attr("width", this.width)
    .attr("height", function(d) { return view._y(d); } );
}

SpectrumAnalyzerView.prototype.update = function() {
  var view = this;
  var color = 'rgb(' + Math.floor(255 * Math.random()) +
    ', ' + Math.floor(255 * Math.random()) +
    ', ' + Math.floor(255 * Math.random()) + ')';

  this.chart.selectAll("rect")
    .data(this.model.data)
    .attr("fill", color)
    .attr("x", function(d, i) { return view._x(i) - .5; })
    .attr("y", function(d) { return view.height - view._y(d) - .5; })
    .attr("width", this.width)
    .attr("height", function(d) { return view._y(d); } );

  this.queueNextUpdate()
}

SpectrumAnalyzerView.prototype.queueNextUpdate = function() {
  var view = this;
  timeout = setTimeout(function() { view.update() }, 50);
  return timeout;
}
