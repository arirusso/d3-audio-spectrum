SA.Audio.Router = function(sampleRate) {
  this._populateContext();
  this.sampleRate = sampleRate || 44100;
  this.isPlaying = false;
  this.bufferSize = 2048;
}

SA.Audio.Router.prototype.connect = function() {
  this.gain = this.context.createGain();
  this.source.connect(this.gain);
}

SA.Audio.Router.prototype.connectProcessor = function(processor) {
  this.gain.connect(processor);
  processor.connect(this.context.destination);
}

SA.Audio.Router.prototype.setGain = function(value) {
  this.gain.gain.value = value;
}

SA.Audio.Router.prototype.stop = function() {
  this.source.stop();
  this.isPlaying = false;
}

SA.Audio.Router.prototype.play = function(callback) {
  var audio = this;
  this.source.load(function() {
    audio.onSourceLoad(callback);
  });
}

SA.Audio.Router.prototype.onSourceLoad = function(callback) {
  this.connect();
  this.source.play();
  this.isPlaying = true;
  callback();
}

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
