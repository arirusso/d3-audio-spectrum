/*
  An audio file that is available by HTTP for analysis
*/
SA.Audio.Source.URL = function(context, url, callback) {
  this._source;

  this._context = context
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

/*
  Method that is called when the analyzer begins playing the file from the URL
*/
SA.Audio.Source.URL.prototype.play = function() {
  this.isPlaying = true;
  this._source.loop = true;
  this._source.start(0);
}

/*
  Method that is called when the analyzer stops playing the file from the URL
*/
SA.Audio.Source.URL.prototype.stop = function() {
  if (this.isPlaying) {
    this._source.stop(0);
    this.disconnect();
  }
  this.isPlaying = false;
}

/*
  Connect the source resource to the gain node
*/
SA.Audio.Source.URL.prototype.connect = function(connector) {
  this._source.connect(connector);
}

/*
  Disconnect the source resource to the gain node
*/
SA.Audio.Source.URL.prototype.disconnect = function() {
  this._source.disconnect();
}

/*
  Method that's called when the response is received from the remote server
*/
SA.Audio.Source.URL.prototype._decode = function(response, callback) {
  this._source = this._context.createBufferSource();

  var url = this;
  this._context.decodeAudioData(response,
    function(buffer) {
      url._source.buffer = buffer;
      callback();
    },
    function() { }
  );
}
