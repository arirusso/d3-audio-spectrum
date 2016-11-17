function AudioInput(context) {
  this.context = context;
}

AudioInput.prototype.load = function(callback) {
  AudioInput.ensureUserMediaIsInitialized();
  var source = this;
  var sourceCallback = function(sourceInfos) {
    source.sourceLoadedCallback(sourceInfos, callback);
  }
  MediaStreamTrack.getSources(sourceCallback);
}

AudioInput.prototype.initializeSource = function(sourceInfo, callback) {
  var args = AudioInput.getSystemArgs(sourceInfo);
  var errorCallback = function(error) {
    console.log(error);
  }
  navigator.getUserMedia(args, this.getStreamLoadedCallback(callback), errorCallback);
}

AudioInput.prototype.play = function() {}

AudioInput.prototype.stop = function() {
  this.disconnect();
}

AudioInput.prototype.connect = function(connector) {
  this.source.connect(connector);
}

AudioInput.prototype.disconnect = function() {
  this.source.disconnect();
}

AudioInput.prototype.getStreamLoadedCallback = function(callback) {
  var source = this;
  return function(stream) {
    source.streamLoadedCallback(stream, callback);
  }
}

AudioInput.prototype.streamLoadedCallback = function(stream, callback) {
  this.source = this.context.createMediaStreamSource(stream, callback);
  callback();
}

AudioInput.prototype.sourceLoadedCallback = function(sourceInfos, callback) {
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === "audio") {
      return this.initializeSource(sourceInfo, callback);
    }
  }
}

AudioInput.getUserMedia = function() {
  return navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

AudioInput.ensureUserMediaIsInitialized = function() {
  if (navigator.getUserMedia == null) {
    navigator.getUserMedia = AudioInput.getUserMedia();
  }
}

AudioInput.getSystemArgs = function(sourceInfo) {
  return {
    audio: {
      optional: [
        { sourceId: sourceInfo.id }
      ]
    }
  };
}
