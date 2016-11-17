SA.Audio.Input = function(context) {
  this.context = context;
}

SA.Audio.Input.prototype.load = function(callback) {
  SA.Audio.Input.ensureUserMediaIsInitialized();
  var source = this;
  var sourceCallback = function(sourceInfos) {
    source.sourceLoadedCallback(sourceInfos, callback);
  }
  MediaStreamTrack.getSources(sourceCallback);
}

SA.Audio.Input.prototype.initializeSource = function(sourceInfo, callback) {
  var args = SA.Audio.Input.getSystemArgs(sourceInfo);
  var errorCallback = function(error) {
    console.log(error);
  }
  navigator.getUserMedia(args, this.getStreamLoadedCallback(callback), errorCallback);
}

SA.Audio.Input.prototype.play = function() {}

SA.Audio.Input.prototype.stop = function() {
  this.disconnect();
}

SA.Audio.Input.prototype.connect = function(connector) {
  this.source.connect(connector);
}

SA.Audio.Input.prototype.disconnect = function() {
  this.source.disconnect();
}

SA.Audio.Input.prototype.getStreamLoadedCallback = function(callback) {
  var source = this;
  return function(stream) {
    source.streamLoadedCallback(stream, callback);
  }
}

SA.Audio.Input.prototype.streamLoadedCallback = function(stream, callback) {
  this.source = this.context.createMediaStreamSource(stream, callback);
  callback();
}

SA.Audio.Input.prototype.sourceLoadedCallback = function(sourceInfos, callback) {
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === "audio") {
      return this.initializeSource(sourceInfo, callback);
    }
  }
}

SA.Audio.Input.getUserMedia = function() {
  return navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

SA.Audio.Input.ensureUserMediaIsInitialized = function() {
  if (navigator.getUserMedia == null) {
    navigator.getUserMedia = AudioInput.getUserMedia();
  }
}

SA.Audio.Input.getSystemArgs = function(sourceInfo) {
  return {
    audio: {
      optional: [
        { sourceId: sourceInfo.id }
      ]
    }
  };
}
