/*
  Spectrum analyzer namespace
*/
SA = function() {}

/*
  Spectrum analyzer application
*/
SA.Application = function() {
  this.audio;
  this.model;
  this.view;
  this.page = new SA.Page();
  this._populateAudioUrl("media/04182011.mp3");
}

/*
  Load the audio file and configure the analyzer
*/
SA.Application.prototype.initialize = function() {
  var app = this;
  this.audio = new SA.Audio.Router();
  this.audio.source = this._getAudioURL(this.audioUrl, function() {
    app.model = new SA.Analysis.Model(app.audio);
    app.view = new SA.Analysis.View(app.model, app.page.getAnalyzerElement());
    app.view.update();
  });
  return true;
}

/*
  Activate audio playback
*/
SA.Application.prototype.play = function() {
  this.page.showWidgetSpinner();
  this.page.setPlayState(true);
  var application = this;
  this.model.play(function() {
    application.page.hideWidgetSpinner();
  });
}

/*
  Sets the audio gain.  The analysis gain is not compensated so this
  adjustment will be reflected in the graph

  Typical values are 0-100, default is 100
*/
SA.Application.prototype.setGain = function(element) {
  var fraction = parseInt(element.value) / parseInt(element.max);
  var value = fraction * fraction;
  this.audio.setGain(value);
}

/*
  Sets the resolution of the analysis

  Typical values are 1-48, default is 48
*/
SA.Application.prototype.setResolution = function(element) {
  this.model.setResolution(48 / element.value);
  this.view.reset();
}

/*
  Sets the depth of the analysis

  Typical values are 0-100, default is 50
*/
SA.Application.prototype.setIntensity = function(element) {
  this.model.intensity = Number(element.value);
}

/*
  Sets the shape (log/lin) of the analysis graph

  Typical values are 1-64, default is 8
*/
SA.Application.prototype.setCurve = function(element) {
  this.model.setCurve(element.value);
  this.view.reset();
}

/*
  Sets the audio source to the local or remote URL depending on
  which has been chosen
*/
SA.Application.prototype.setAudioSourceToFile = function() {
  var application = this;
  this.page.setInputSelectButtonText("Use Audio Input");
  this.audio.source = this._getAudioURL(this.audioUrl);
  return this.audio.source;
}

/*
  Sets the audio source to the audio input (eg microphone)
*/
SA.Application.prototype.setAudioSourceToInput = function() {
  this.page.setInputSelectButtonText("Use Audio URL")
  this.audio.source = this._getAudioInput();
  this._handleSourceLoaded();
  this.play();
  return this.audio.source;
}

/*
  Toggles the audio source from the audio input (eg microphone) to an audio file
  or vice versa
*/
SA.Application.prototype.toggleAudioSource = function() {
  this.stop();
  if (this.audio.source instanceof SA.Audio.Source.URL) {
    this.setAudioSourceToInput();
  } else if (this.audio.source instanceof SA.Audio.Source.Device) {
    this.setAudioSourceToFile();
  }
  return this.audio.source;
}

/*
  Toggles audio playback
*/
SA.Application.prototype.togglePlay = function() {
  this.audio.isPlaying ? this.stop() : this.play();
  return this.audio.isPlaying;
}

/*
  Stops audio playback
*/
SA.Application.prototype.stop = function() {
  this.audio.stop();
  this.page.setPlayState(false);
}

/*
  Requests and returns the audio file from the given URL.  The given callback
  is fired when the request is complete
*/
SA.Application.prototype._getAudioURL = function(url, callback) {
  var app = this;
  return new SA.Audio.Source.URL(this.audio.context, url, function() {
    app._handleSourceLoaded(callback);
  });
}

/*
  Gets an Audio.Input instance that reflects the application state
*/
SA.Application.prototype._getAudioInput = function() {
  return new SA.Audio.Source.Device(this.audio.context);
}

/*
  Populates the page with an audio URL if there is one in the HTTP request params.
  If there isn't, the URL is given the passed in value
*/
SA.Application.prototype._populateAudioUrl = function(defaultUrl) {
  var src = this._getRequestParams().src;
  if (src !== undefined && src !== null && src != "") {
    this.audioUrl = "/audio?src=" + this._getRequestParams().src;
    this.page.setUrlInputValue(unescape(src));
  } else {
    this.audioUrl = defaultUrl;
  }
  return this.audioUrl;
}

/*
  Method that is executed when the audio source is finished initializing
*/
SA.Application.prototype._handleSourceLoaded = function(callback) {
  this.page.hideAudioSpinner();
  this.page.showAnalyzer();
  this.page.showControls();
  if (callback !== undefined && callback !== null) {
    callback();
  }
  return this.audio.source;
}

/*
  Gets the audio URL from the HTTP request URL params
*/
SA.Application.prototype._getRequestParams = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0; i<vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
}

// Class Methods

/*
  Load the audio file and configure the analyzer
*/
SA.Application.initialize = function() {
  this.instance = new SA.Application();
  this.instance.initialize();
  return this.instance;
}

/*
  Activate audio playback
*/
SA.Application.play = function() {
  this.instance.play();
  return this.instance;
}

/*
  Sets the audio gain.  The analysis gain is not compensated so this
  adjustment will be reflected in the graph

  Typical values are 0-100, default is 100
*/
SA.Application.setGain = function(element) {
  this.instance.setGain(element);
  return this.instance;
}

/*
  Sets the depth of the analysis

  Typical values are 0-100, default is 50
*/
SA.Application.setIntensity = function(element) {
  this.instance.setIntensity(element);
  return this.instance;
}

/*
  Sets the resolution of the analysis

  Typical values are 1-48, default is 48
*/
SA.Application.setResolution = function(element) {
  this.instance.setResolution(element);
  return this.instance;
}

/*
  Sets the shape (log/lin) of the analysis graph

  Typical values are 1-64, default is 8
*/
SA.Application.setCurve = function(element) {
  this.instance.setCurve(element);
  return this.instance;
}

/*
  Toggles the audio source from the audio input (eg microphone) to an audio file
  or vice versa
*/
SA.Application.toggleAudioSource = function() {
  this.instance.toggleAudioSource();
  return this.instance;
}

/*
  Toggles audio playback
*/
SA.Application.togglePlay = function() {
  this.instance.togglePlay();
  return this.instance;
}

/*
  Stops audio playback
*/
SA.Application.stop = function() {
  this.instance.stop();
  return this.instance;
}
