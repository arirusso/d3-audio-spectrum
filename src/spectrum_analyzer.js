function SpectrumAnalyzer(audio) {
  this.audio = audio;
  this.initialize();
}

SpectrumAnalyzer.prototype.initialize = function() {
  var spectrumAnalyzer = this;

  this.analysis = this.audio.context.createJavaScriptNode(1024);
  this.analysis.onaudioprocess = function(event) { 
    spectrumAnalyzer.audioReceived(event); 
  };

  this.audio.gain.connect(this.analysis);
  this.analysis.connect(this.audio.context.destination);

  this.data = new Array();
  this.bufferSize = 2048;
  this.delta = new Float32Array(this.bufferSize/8);	
  this.fft = new FFT(this.bufferSize/8, this.sampleRate);
}

SpectrumAnalyzer.prototype.audioReceived = function(event) {
  this.audio.routeAudio(event);   
  this.fft.forward(this.audio.mono);
  for ( var i = 0; i < this.fft.spectrum.length; i++ ) {
    amplitude = this.fft.spectrum[i] * 1000;
    this.delta[i] = amplitude - this.data[i];
    this.data[i] = amplitude;
  }
}
