function InputAudioSource(context) {
  this.context = context;
}

InputAudioSource.prototype.load = function(callback) {
  navigator.webkitGetUserMedia( {audio:true}, this.streamCallback(callback) );
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

