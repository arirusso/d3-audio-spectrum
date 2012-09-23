function UrlAudioSource(context, url, callback) {
  this.context = context;
  this.url = url;
  this.callback = callback;
  this.source = this.context.createBufferSource();
  this.load();
}

UrlAudioSource.prototype.load = function() {
  var source = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.url, true);
  request.responseType = "arraybuffer";
  request.onload = function() { 
    source.afterLoad(request.response);
  }
  request.send();
}

UrlAudioSource.prototype.afterLoad = function(response) {
  var source = this;
  this.context.decodeAudioData(response, function(buffer) {
      source.source.buffer = buffer;
    }, function() { });
  this.source.looping = true;
  this.source.noteOn(0);
  this.callback();
}

UrlAudioSource.prototype.connect = function(connector) {
  this.source.connect(connector);
}

