function SpectrumAnalyzer(audio) {
  this.audio = audio;
  this.data = new Array();
  this.delta = new Float32Array(this.audio.bufferSize/8);	
  this.fft = new FFT(this.audio.bufferSize/8, this.sampleRate);
  this.connect();
}

SpectrumAnalyzer.prototype.connect = function() {
  var analyzer = this;

  this.analysis = this.audio.context.createJavaScriptNode(1024);
  this.analysis.onaudioprocess = function(event) { 
    analyzer.audioReceived(event); 
  };

  this.audio.connect();
  this.audio.connectProcessor(this.analysis);
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
