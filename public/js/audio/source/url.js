SA.Audio.Source.URL = function(context, url, callback) {
  this.context = context
  this.url = url;
  this.isPlaying = false;
  this.load(callback);
}

/*
  Make the HTTP request to load the file and fire the given callback when finished
*/
SA.Audio.Source.URL.prototype.load = function(callback) {
  var source = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    source._decode(request.response, callback);
  }
  request.send();
}

SA.Audio.Source.URL.prototype.play = function() {
  this.isPlaying = true;
  this.source.loop = true;
  this.source.start(0);
}

SA.Audio.Source.URL.prototype.stop = function() {
  if (this.isPlaying) {
    this.source.stop(0);
    this.disconnect();
  }
  this.isPlaying = false;
}

SA.Audio.Source.URL.prototype.connect = function(connector) {
  this.source.connect(connector);
}

SA.Audio.Source.URL.prototype.disconnect = function() {
  this.source.disconnect();
}

SA.Audio.Source.URL.prototype._decode = function(response, callback) {
  var file = this;
  this.source = this.context.createBufferSource();
  this.context.decodeAudioData(response,
    function(buffer) {
      file.source.buffer = buffer;
      callback();
    },
    function() { }
  );
}
