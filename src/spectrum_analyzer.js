function SpectrumAnalyzer(context, source) {
  this.context = context;
  this.source = source;
  this.initialize();
}

SpectrumAnalyzer.prototype.initialize = function() {
  this.initializeRouting();  
  this.initializeFFT();
}

SpectrumAnalyzer.prototype.initializeRouting = function() {
  var spectrumAnalyzer = this;

  this.analysis = this.context.createJavaScriptNode(1024);
  this.analysis.onaudioprocess = function(event) { 
    spectrumAnalyzer.audioReceived(event); 
  };

  this.source.connect(this.analysis);
  this.analysis.connect(this.context.destination);
}

SpectrumAnalyzer.prototype.initializeFFT = function() {
  this.data = new Array();
  var bufferSize = 256;
  this.mono = new Float32Array(bufferSize);
  this.delta = new Float32Array(bufferSize);	
  this.fft = new FFT(bufferSize, 44100);
}

SpectrumAnalyzer.prototype.routeAudio = function(event) {
  var input = {
    l: event.inputBuffer.getChannelData(0),
    r: event.inputBuffer.getChannelData(1)
  }
  var output = { 
    l: event.outputBuffer.getChannelData(0),
    r: event.outputBuffer.getChannelData(1)
  };
			
  for (var i = 0; i < this.mono.length; ++i) {
    output.l[i] = input.l[i];
    output.r[i] = input.r[i];
    this.mono[i] = (input.l[i] + input.r[i]) / 2;
  }
}

SpectrumAnalyzer.prototype.audioReceived = function(event) {
  this.routeAudio(event);   
  this.fft.forward(this.mono);
  for ( var i = 0; i < this.fft.spectrum.length; i++ ) {
    amplitude = this.fft.spectrum[i] * 1000;
    this.delta[i] = amplitude - this.data[i];
    this.data[i] = amplitude;
  }
}
