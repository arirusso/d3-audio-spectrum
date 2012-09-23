function SpectrumAnalyzer(context, source, sampleRate) {
  this.context = context;
  this.source = source;
  this.sampleRate = sampleRate || 44100;
  this.playing = true;
  this.initialize();
}

SpectrumAnalyzer.prototype.initialize = function() {
  this.initializeRouting();
  this.initializeFFT();
  this.play();
}

SpectrumAnalyzer.prototype.initializeRouting = function() {
  var spectrumAnalyzer = this;

  this.analysis = this.context.createJavaScriptNode(1024);
  this.analysis.onaudioprocess = function(event) { 
    spectrumAnalyzer.audioReceived(event); 
  };

  this.gain = context.createGainNode();
  this.source.connect(this.gain);
  this.gain.connect(this.analysis);
  this.analysis.connect(this.context.destination);
}

SpectrumAnalyzer.prototype.setVolume = function(element) {
  var fraction=parseInt(element.value)/parseInt(element.max);
  this.gain.gain.value=fraction*fraction;
}

SpectrumAnalyzer.prototype.stop = function() { 
  this.source.source.noteOff(0);
  this.playing = false;
};

SpectrumAnalyzer.prototype.play = function() {
  var source = this.source;
  var spectrumAnalyzer = this;
  this.source.load(function() {
    source.source.loop = true;
    source.source.noteOn(0);
    spectrumAnalyzer.playing = true;
  });
}

SpectrumAnalyzer.prototype.toggle = function() {
  this.playing ? this.stop() : this.play(); 
};

SpectrumAnalyzer.prototype.initializeFFT = function() {
  this.data = new Array();
  this.bufferSize = 2048;
  this.mono = new Float32Array(this.bufferSize/8);
  this.delta = new Float32Array(this.bufferSize/8);	
  this.fft = new FFT(this.bufferSize/8, this.sampleRate);
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
			
  for (var i = 0; i < this.bufferSize; ++i) {
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
