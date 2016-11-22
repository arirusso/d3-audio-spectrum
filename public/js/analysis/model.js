/*
  This is where the audio data is modeled for analysis
*/
SA.Analysis.Model = function(audio) {
  this._delta;
  this._fft;
  this._resolution;

  this.data;

  this._audio = audio;
  this._analysis = this._audio.context.createScriptProcessor(this._audio.bufferSize);
  this._curve = 8;
  this._intensity = 50;
  this.setResolution(1);
}

/*
  Set the resolution of the analysis
*/
SA.Analysis.Model.prototype.setResolution = function(n) {
  this._resolution = this._upperPowerOfTwo(this._audio.bufferSize / n);
  this.reset();
}

/*
  Set the lin/log curve amount of the analysis
*/
SA.Analysis.Model.prototype.setCurve = function(n) {
  this._curve = n;
  this.reset();
}

/*
  Reset the analyzer model
*/
SA.Analysis.Model.prototype.reset = function() {
  this.data = [];
  this._delta = [];
  var fftSize = this._resolution;
  this._audio.mono = new Float32Array(fftSize);
  this._fft = new FFT(fftSize, this._audio.sampleRate);

  var analyzer = this;
  this._analysis.onaudioprocess = function(event) {
    analyzer._audioReceived(event);
  };
}

/*
  Get the number of frequency bands of the underlying model
*/
SA.Analysis.Model.prototype.getLength = function() {
  return this._fft.spectrum.length / 2;
}

/*
  Start analysis on the audio
*/
SA.Analysis.Model.prototype.play = function(callback) {
  var analyzer = this;
  this._audio.play(function() {
    analyzer._audio.connectProcessor(analyzer._analysis);
    callback();
  });
}

/*
  Get an array that is the size of the data model, filled with zeros
*/
SA.Analysis.Model.prototype.getInitialData = function() {
  // fill array with 0
  return Array.apply(null, Array(this.getLength())).map(Number.prototype.valueOf, 0);
}

/*
  Resolution should be a power of two, this method calculates that
*/
SA.Analysis.Model.prototype._upperPowerOfTwo = function(n) {
  return Math.pow(2, Math.round(Math.log(n) / Math.log(2)));
}

/*
  Execute the given callback using the current analyzer response curve
*/
SA.Analysis.Model.prototype._withCurve = function(callback) {
  var segmentLength = this.getLength() / this._curve;
  var segmentCounter = 0;
  var segment = 0;
  var counter = 0;
  var index = 0;
  while (index <= this.getLength() - 1) {
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
  this._delta[counter] = amplitude - this.data[counter];
  this.data[counter] = amplitude;
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
