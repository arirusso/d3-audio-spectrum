function InputAudioSource(context) {
  this.context = context;
}

InputAudioSource.prototype.load = function(callback) {
  if (navigator.getUserMedia == null) {
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  }
  var source = this;
  var sourceCallback = function(sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === "audio") {
        return source.initializeSource(sourceInfo, callback);
      }
    }
  }
  MediaStreamTrack.getSources(sourceCallback);
}

InputAudioSource.prototype.initializeSource = function(sourceInfo, callback) {
  var args = {
    audio: {
      optional: [
        { sourceId: sourceInfo.id }
      ]
    }
  };
  var errorCallback = function(error) {
    console.log(error);
  }
  navigator.getUserMedia(args, this.streamCallback(callback), errorCallback);
}

InputAudioSource.prototype.play = function() {}

InputAudioSource.prototype.stop = function() {
  this.disconnect();
}

InputAudioSource.prototype.streamCallback = function(callback) {
  var source = this;
  return function(stream) {
    source.source = source.context.createMediaStreamSource(stream);
    callback();
  }
}

InputAudioSource.prototype.connect = function(connector) {
  this.source.connect(connector);
}

InputAudioSource.prototype.disconnect = function() {
  this.source.disconnect();
}

