function Application() {
  this.audio;
  this.context;
  this.model;
  this.source;
  this.view;
  this.page = new Page();
  this.populateAudioUrl("media/sweep.mp3");
}

Application.prototype.populateAudioUrl = function(defaultUrl) {
  var src = this.query().src;
  if (src !== undefined && src !== null && src != "") {
    this.audioUrl = "/audio?src=" + this.query().src;
    this.page.setUrlInputValue(unescape(src));
  } else {
    this.audioUrl = defaultUrl;
  }
}

Application.prototype.query = function () {
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

Application.prototype.load = function() {
  var app = this;
  this.populateContext();
  this.audio = new Audio(this.context);
  this.source = this.sourceFromUrl(this.audioUrl, function() {
    app.model = new SpectrumAnalyzer(app.audio);
    app.view = new SpectrumAnalyzerView(app.model, "#spectrumAnalyzer");
    app.view.update();
  });
}

Application.prototype.sourceFromUrl = function(url, callback) {
  var app = this;
  return new RemoteAudioFile(this.context, url, function() {
    app.onSourceLoaded(callback);
  });
}

Application.prototype.sourceFromInput = function() {
  var app = this;
  return new AudioInput(this.context);
}

Application.prototype.onSourceLoaded = function(callback) {
  this.page.hideAudioSpinner();
  this.page.showAnalyzer();
  this.page.showControls();
  this.audio.source = this.source;
  if (callback !== undefined && callback !== null) {
    callback();
  }
}

Application.prototype.play = function() {
  this.page.showWidgetSpinner();
  this.page.setPlayState(true);
  var application = this;
  this.model.play(function() {
    application.page.hideWidgetSpinner();
  });
}

Application.prototype.setVolume = function(element) {
  var fraction = parseInt(element.value) / parseInt(element.max);
  var value = fraction * fraction;
  this.audio.setVolume(value);
}

Application.prototype.setResolution = function(element) {
  this.model.setResolution(48 / element.value);
  this.view.reset();
}

Application.prototype.setIntensity = function(element) {
  this.model.intensity = Number(element.value);
}

Application.prototype.setCurve = function(element) {
  this.model.setCurve(element.value);
  this.view.reset();
}

Application.prototype.selectAudioFile = function() {
  var application = this;
  this.page.setInputSelectButtonText("Use Audio Input");
  this.source = this.sourceFromUrl(this.audioUrl);
}

Application.prototype.selectAudioInput = function() {
  this.page.setInputSelectButtonText("Use Audio URL")
  this.source = this.sourceFromInput();
  this.onSourceLoaded();
  this.play();
}

Application.prototype.toggleAudioInput = function() {
  this.stop();
  if (this.source instanceof RemoteAudioFile) {
    this.selectAudioInput();
  } else if (this.source instanceof AudioInput) {
    this.selectAudioFile();
  }
}

Application.prototype.togglePlay = function() {
  this.audio.playing ? this.stop() : this.play();
}

Application.prototype.stop = function() {
  this.audio.stop();
  this.page.setPlayState(false);
}

Application.prototype.populateContext = function() {
  if (typeof AudioContext !== "undefined") {
    this.context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    window.AudioContext = window.webkitAudioContext;
  } else {
    throw new Error("AudioContext not supported.");
  }
  this.context = new AudioContext();
}

// Class Methods

Application.load = function() {
  this.instance = new Application();
  this.instance.load();
}

Application.play = function() {
  this.instance.play();
}

Application.setVolume = function(element) {
  this.instance.setVolume(element);
}

Application.setIntensity = function(element) {
  this.instance.setIntensity(element);
}

Application.setResolution = function(element) {
  this.instance.setResolution(element);
}

Application.setCurve = function(element) {
  this.instance.setCurve(element);
}

Application.toggleAudioInput = function() {
  this.instance.toggleAudioInput();
}

Application.togglePlay = function() {
  this.instance.togglePlay();
}

Application.stop = function() {
  this.instance.stop();
}
