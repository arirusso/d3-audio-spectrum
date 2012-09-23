function UrlAudioSource(context, url, callback) {
  this.context = context;
  this.url = url;
  this.source = this.context.createBufferSource();
  this.load(callback);
}

UrlAudioSource.prototype.load = function(callback) {
  var source = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  request.onload = function() { 
    source.afterLoad(request.response, callback);
  }
  request.send();
}

UrlAudioSource.prototype.afterLoad = function(response, callback) {
  var source = this;
  this.context.decodeAudioData(response, function(buffer) {
      source.source.buffer = buffer;
      callback();
    }, function() { });
}

UrlAudioSource.prototype.connect = function(connector) {
  this.source.connect(connector);
}

