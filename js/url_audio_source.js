function UrlAudioSource(url, callback) {
  this.context = new webkitAudioContext();
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

