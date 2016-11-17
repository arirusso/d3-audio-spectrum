SA.Audio.RemoteFile = function(context, url, callback) {
  this.context = context
  this.url = url;
  this.isPlaying = false;
  this.load(callback);
}

SA.Audio.RemoteFile.prototype.load = function(callback) {
  var source = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    source.decode(request.response, callback);
  }
  request.send();
}

SA.Audio.RemoteFile.prototype.play = function() {
  this.isPlaying = true;
  this.source.loop = true;
  this.source.start(0);
}

SA.Audio.RemoteFile.prototype.stop = function() {
  if (this.isPlaying) {
    this.source.stop(0);
    this.disconnect();
  }
  this.isPlaying = false;
}

SA.Audio.RemoteFile.prototype.decode = function(response, callback) {
  var source = this;
  this.source = this.context.createBufferSource();
  this.context.decodeAudioData(response,
    function(buffer) {
      source.source.buffer = buffer;
      callback();
    },
    function() { }
  );
}

SA.Audio.RemoteFile.prototype.connect = function(connector) {
  this.source.connect(connector);
}

SA.Audio.RemoteFile.prototype.disconnect = function() {
  this.source.disconnect();
}
