/*
  Connects the audio source to both audio playback and the analysis modeler
*/
SA.Audio.Router = function(sampleRate) {
  this._gain;
  
  this.context;
  this.source;

  this.sampleRate = sampleRate || 44100;
  this.isPlaying = false;
  this.bufferSize = 2048;
  this._populateContext();
}

/*
  Connect the spectrum analyzer widget to the gain node and the Web Audio
  context
*/
SA.Audio.Router.prototype.connectProcessor = function(processor) {
  this._gain.connect(processor);
  processor.connect(this.context.destination);
}

/*
  Set the audio gain amount to the specified value
*/
SA.Audio.Router.prototype.setGain = function(value) {
  this._gain.gain.value = value;
}

/*
  Stop audio playback and analysis
*/
SA.Audio.Router.prototype.stop = function() {
  this.source.stop();
  this.isPlaying = false;
}

/*
  Start audio playback and analysis
*/
SA.Audio.Router.prototype.play = function(callback) {
  var router = this;
  this.source.load(function() {
    router._onSourceLoad(callback);
  });
}

/*
  Connect the audio source to both the spectrum analyzer modeler and the
  browser audio output
*/
SA.Audio.Router.prototype.routeAudio = function(event) {
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

/*
  Create a gain node and connect it to the audio source
*/
SA.Audio.Router.prototype._initializeGain = function() {
  this._gain = this.context.createGain();
  this.source.connect(this._gain);
}

/*
  Method to run when audio is finished loading for playback/analysis start
*/
SA.Audio.Router.prototype._onSourceLoad = function(callback) {
  this._initializeGain();
  if (this.source.play !== undefined && this.source.play !== null) {
    this.source.play();
  }
  this.isPlaying = true;
  callback();
}

/*
  Populates the Web Audio context
*/
SA.Audio.Router.prototype._populateContext = function() {
  if (typeof AudioContext !== "undefined") {
    this.context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    window.AudioContext = window.webkitAudioContext;
  } else {
    throw new Error("AudioContext not supported.");
  }
  this.context = new AudioContext();
  return this.context;
}
