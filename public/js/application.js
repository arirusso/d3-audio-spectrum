function Application() {
  this.populateUrl("media/sweep.mp3");
  this.audio;
  this.context;
  this.model;
  this.source;
  this.view;
}

Application.prototype.populateUrl = function(defaultUrl) {
  var src = this.query().src;
  if (src != null && src != "") {
    this.url = "/audio?src=" + this.query().src;
    document.getElementById("audioUrl").value = unescape(src);
  } else {
    this.url = defaultUrl;
  }
}

Application.prototype.query = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
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
  this.source = this.sourceFromUrl(this.url, function() {
    app.model = new SpectrumAnalyzer(app.audio);
    app.view = new SpectrumAnalyzerView(app.model, "#spectrum_analyzer");
    app.view.update();
  });
}

Application.prototype.sourceFromUrl = function(url, callback) {
  var app = this;
  return new UrlAudioSource(this.context, url, function() { 
    app.onSourceLoaded(callback); 
  });
}

Application.prototype.sourceFromInput = function() {
  var app = this;
  return new InputAudioSource(this.context);
}

Application.prototype.onSourceLoaded = function(callback) {
  document.getElementById("loading").style.display = 'none';
  document.getElementById("spectrum_analyzer").style.display = 'block';
  document.getElementById("controls").style.display = 'inline';
  this.audio.source = this.source;
  if (callback != null) {
    callback();
  }
}

Application.prototype.play = function() {
  document.getElementById("loader").style.display = 'block';
  var element = document.getElementById('play');
  element.value = "Stop";
  this.model.play(function() {
    document.getElementById("loader").style.display = 'none';
  });
}

Application.prototype.setVolume = function(element) {
  var fraction = parseInt(element.value) / parseInt(element.max);
  var value = fraction * fraction;
  this.audio.setVolume(value);  
}

Application.prototype.setResolution = function(element) {
  this.model.setResolution(48/element.value);  
  this.view.reset();
}

Application.prototype.setIntensity = function(element) {
  this.model.intensity = Number(element.value);
}

Application.prototype.setCurve = function(element) {
  this.model.setCurve(element.value);  
  this.view.reset();
}

Application.prototype.toggleInput = function() {
  var app = this;
  var element = document.getElementById('input');
  var callback = function() { app.play(); };
  this.stop();
  if (this.source instanceof UrlAudioSource) {
    element.value = "Use Audio URL";
    this.source = this.sourceFromInput();
    this.onSourceLoaded(); 
    this.play();
  } else if (this.source instanceof InputAudioSource) {
    element.value = "Use Audio Input";
    this.source = this.sourceFromUrl(this.url, callback);
  }
}

Application.prototype.togglePlay = function() {
  this.audio.playing ? this.stop() : this.play();
}

Application.prototype.stop = function() { 
  this.audio.stop();
  var element = document.getElementById('play');
  element.value = "Play";
}

Application.prototype.populateContext = function() {
  if (typeof AudioContext !== "undefined") {
    this.context = new AudioContext();
  } else if (typeof webkitAudioContext !== "undefined") {
    window.AudioContext = window.webkitAudioContext;
  } else {
    throw new Error('AudioContext not supported. :(');
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

Application.toggleInput = function() {
  this.instance.toggleInput();
}

Application.togglePlay = function() {
  this.instance.togglePlay();
}

Application.stop = function() { 
  this.instance.stop();
}

