SA = function() {}

SA.Application = function() {
  this.audio;
  this.context;
  this.model;
  this.source;
  this.view;
  this.page = new SA.Page();
  this.populateAudioUrl("media/sweep.mp3");
}

SA.Application.prototype.populateAudioUrl = function(defaultUrl) {
  var src = this.query().src;
  if (src !== undefined && src !== null && src != "") {
    this.audioUrl = "/audio?src=" + this.query().src;
    this.page.setUrlInputValue(unescape(src));
  } else {
    this.audioUrl = defaultUrl;
  }
}

SA.Application.prototype.query = function () {
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

SA.Application.prototype.load = function() {
  var app = this;
  this.populateContext();
  this.audio = new SA.Audio.Router(this.context);
  this.source = this.sourceFromUrl(this.audioUrl, function() {
    app.model = new SA.Analysis.Model(app.audio);
    app.view = new SA.Analysis.View(app.model, "#spectrumAnalyzer");
    app.view.update();
  });
}

SA.Application.prototype.sourceFromUrl = function(url, callback) {
  var app = this;
  return new SA.Audio.RemoteFile(this.context, url, function() {
    app.onSourceLoaded(callback);
  });
}

SA.Application.prototype.sourceFromInput = function() {
  var app = this;
  return new SA.Audio.Input(this.context);
}

SA.Application.prototype.onSourceLoaded = function(callback) {
  this.page.hideAudioSpinner();
  this.page.showAnalyzer();
  this.page.showControls();
  this.audio.source = this.source;
  if (callback !== undefined && callback !== null) {
    callback();
  }
}

SA.Application.prototype.play = function() {
  this.page.showWidgetSpinner();
  this.page.setPlayState(true);
  var application = this;
  this.model.play(function() {
    application.page.hideWidgetSpinner();
  });
}

SA.Application.prototype.setGain = function(element) {
  var fraction = parseInt(element.value) / parseInt(element.max);
  var value = fraction * fraction;
  this.audio.setGain(value);
}

SA.Application.prototype.setResolution = function(element) {
  this.model.setResolution(48 / element.value);
  this.view.reset();
}

SA.Application.prototype.setIntensity = function(element) {
  this.model.intensity = Number(element.value);
}

SA.Application.prototype.setCurve = function(element) {
  this.model.setCurve(element.value);
  this.view.reset();
}

SA.Application.prototype.selectAudioFile = function() {
  var application = this;
  this.page.setInputSelectButtonText("Use Audio Input");
  this.source = this.sourceFromUrl(this.audioUrl);
}

SA.Application.prototype.selectAudioInput = function() {
  this.page.setInputSelectButtonText("Use Audio URL")
  this.source = this.sourceFromInput();
  this.onSourceLoaded();
  this.play();
}

SA.Application.prototype.toggleAudioInput = function() {
  this.stop();
  if (this.source instanceof SA.Audio.RemoteFile) {
    this.selectAudioInput();
  } else if (this.source instanceof SA.Audio.Input) {
    this.selectAudioFile();
  }
}

SA.Application.prototype.togglePlay = function() {
  this.audio.playing ? this.stop() : this.play();
}

SA.Application.prototype.stop = function() {
  this.audio.stop();
  this.page.setPlayState(false);
}

SA.Application.prototype.populateContext = function() {
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

SA.Application.load = function() {
  this.instance = new SA.Application();
  this.instance.load();
}

SA.Application.play = function() {
  this.instance.play();
}

SA.Application.setGain = function(element) {
  this.instance.setGain(element);
}

SA.Application.setIntensity = function(element) {
  this.instance.setIntensity(element);
}

SA.Application.setResolution = function(element) {
  this.instance.setResolution(element);
}

SA.Application.setCurve = function(element) {
  this.instance.setCurve(element);
}

SA.Application.toggleAudioInput = function() {
  this.instance.toggleAudioInput();
}

SA.Application.togglePlay = function() {
  this.instance.togglePlay();
}

SA.Application.stop = function() {
  this.instance.stop();
}
