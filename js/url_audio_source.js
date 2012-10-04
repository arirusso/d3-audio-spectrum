function UrlAudioSource(context, url, callback) {
  this.context = context 
  this.url = url;
  this.load(callback);
}

UrlAudioSource.prototype.load = function(callback) {
  var source = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  request.onload = function() { 
    source.decode(request.response, callback);
  }
  request.send();
}

UrlAudioSource.prototype.play = function() {
  this.source.loop = true;
  this.source.noteOn(0);
}

UrlAudioSource.prototype.stop = function() {
  this.source.noteOff(0);
  this.disconnect();
}

UrlAudioSource.prototype.decode = function(response, callback) {
  var source = this;
  this.source = this.context.createBufferSource();
  this.context.decodeAudioData(response, function(buffer) {
    source.source.buffer = buffer;
    callback();
  }, function() { });
}

UrlAudioSource.prototype.connect = function(connector) {
  this.source.connect(connector);
}

UrlAudioSource.prototype.disconnect = function() {
  this.source.disconnect();
}

