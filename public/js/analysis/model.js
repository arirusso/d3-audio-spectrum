/*
  This is where the audio data is modeled for analysis
*/
SA.Analysis.Model = function(audio) {
  this.audio = audio;
  this.analysis = this.audio.context.createScriptProcessor(this.audio.bufferSize);
  this.curve = 8;
  this.intensity = 50;
  this.setResolution(1);
}

SA.Analysis.Model.prototype.setResolution = function(n) {
  this.resolution = this._linLog(this.audio.bufferSize / n);
  this.reset();
}

SA.Analysis.Model.prototype.setCurve = function(n) {
  this.curve = n;
  this.reset();
}

SA.Analysis.Model.prototype.reset = function() {
  this.data = [];
  this.delta = [];
  var fftSize = this.resolution;
  this.audio.mono = new Float32Array(fftSize);
  this.fft = new FFT(fftSize, this.audio.sampleRate);
  var analyzer = this;
  this.analysis.onaudioprocess = function(event) {
    analyzer._audioReceived(event);
  };
}

SA.Analysis.Model.prototype.length = function() {
  return this.fft.spectrum.length/2;
}

SA.Analysis.Model.prototype.play = function(callback) {
  var analyzer = this;
  this.audio.play(function() {
    analyzer.audio.connectProcessor(analyzer.analysis);
    callback();
  });
}

SA.Analysis.Model.prototype.getInitialData = function() {
  var data = [];
  for (var i = 0; i < this.length(); i++) {
    data.push(1);
  };
  return data;
}

SA.Analysis.Model.prototype._linLog = function(n) {
  return Math.pow( 2, Math.round( Math.log( n ) / Math.log( 2 ) ) );
}

/*
  Execute the given callback using the current analyzer response curve
*/
SA.Analysis.Model.prototype._withCurve = function(callback) {
  var segmentLength = this.length() / this.curve;
  var segmentCounter = 0;
  var segment = 0;
  var counter = 0;
  var index = 0;
  while (index <= this.length() - 1) {
    callback(index, counter);
    index += (segment * this.curve) + 1;
    counter += 1;
    segmentCounter += 1;
    if (segmentCounter > segmentLength - 1) {
      segment += 1;
      segmentCounter = 0;
    }
  }
}

/*
  Populate the graph data using the current audio frames
*/
SA.Analysis.Model.prototype._populateData = function(index, counter) {
  amplitude = this.fft.spectrum[index] * (this.intensity * 200);
  this.delta[counter] = amplitude - this.data[counter];
  this.data[counter] = amplitude;
}

/*
  Method that is called when a new audio frame is available
*/
SA.Analysis.Model.prototype._audioReceived = function(event) {
  this.audio.routeAudio(event);
  this.fft.forward(this.audio.mono);

  var analyzer = this;
  this._withCurve(function(index, counter) {
    analyzer._populateData(index, counter)
  });
}
