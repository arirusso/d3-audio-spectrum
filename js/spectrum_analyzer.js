function SpectrumAnalyzer(audio) {
  this.audio = audio;
  this.analysis = this.audio.context.createJavaScriptNode(this.audio.bufferSize);
  this.setResolution(1);
}

SpectrumAnalyzer.prototype.setResolution = function(n) {
  this.data = [];
  this.delta = [];
  this.resolution = Math.pow( 2, Math.round( Math.log(  this.audio.bufferSize/n) / Math.log( 2 ) ) );
  console.log(this.resolution);
  var fftSize = this.resolution;
  this.audio.mono = new Float32Array(fftSize);
  this.fft = new FFT(fftSize, this.audio.sampleRate);
  var analyzer = this;
  this.analysis.onaudioprocess = function(event) { 
    analyzer.audioReceived(event); 
  };
}

SpectrumAnalyzer.prototype.length = function() {
  return this.fft.spectrum.length/2;
}

SpectrumAnalyzer.prototype.play = function() {
  var analyzer = this;
  this.audio.play(function() {
    analyzer.audio.connectProcessor(analyzer.analysis);
  });
}

SpectrumAnalyzer.prototype.getInitialData = function() {
  var data = [];
  for (var i = 0; i < this.length(); i++) { 
    data.push(1); 
  };
  return data;
}

SpectrumAnalyzer.prototype.audioReceived = function(event) {
  this.audio.routeAudio(event);   
  this.fft.forward(this.audio.mono);
  for ( var i = 0; i < this.length(); i++) {
    amplitude = this.fft.spectrum[i] * 1000;
    this.delta[i] = amplitude - this.data[i];
    this.data[i] = amplitude;
  }
}
