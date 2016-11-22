/*
  This is where the audio data is modeled for analysis
*/
SA.Analysis.Model = function(audio) {
  this._data;
  this._delta;
  this._fft;
  this._resolution;

  this._audio = audio;
  this._analysis = this._audio.context.createScriptProcessor(this._audio.bufferSize);
  this._curve = 8;
  this._intensity = 50;
  this.setResolution(1);
}

SA.Analysis.Model.prototype.setResolution = function(n) {
  this._resolution = this._linLog(this._audio.bufferSize / n);
  this.reset();
}

SA.Analysis.Model.prototype.setCurve = function(n) {
  this._curve = n;
  this.reset();
}

SA.Analysis.Model.prototype.reset = function() {
  this._data = [];
  this._delta = [];
  var fftSize = this._resolution;
  this._audio.mono = new Float32Array(fftSize);
  this._fft = new FFT(fftSize, this._audio.sampleRate);
  var analyzer = this;
  this._analysis.onaudioprocess = function(event) {
    analyzer._audioReceived(event);
  };
}

SA.Analysis.Model.prototype.length = function() {
  return this._fft.spectrum.length/2;
}

SA.Analysis.Model.prototype.play = function(callback) {
  var analyzer = this;
  this._audio.play(function() {
    analyzer._audio.connectProcessor(analyzer.analysis);
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
  var segmentLength = this.length() / this._curve;
  var segmentCounter = 0;
  var segment = 0;
  var counter = 0;
  var index = 0;
  while (index <= this.length() - 1) {
    callback(index, counter);
    index += (segment * this._curve) + 1;
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
  amplitude = this._fft.spectrum[index] * (this._intensity * 200);
  this._delta[counter] = amplitude - this._data[counter];
  this._data[counter] = amplitude;
}

/*
  Method that is called when a new audio frame is available
*/
SA.Analysis.Model.prototype._audioReceived = function(event) {
  this._audio.routeAudio(event);
  this._fft.forward(this._audio.mono);

  var analyzer = this;
  this._withCurve(function(index, counter) {
    analyzer._populateData(index, counter)
  });
}
