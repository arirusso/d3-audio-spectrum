function Application() {
  this.audio;
  this.context;
  this.model;
  this.source;
  this.view;
}

Application.prototype.load = function() {
  var application = this;
  this.populateContext();
  this.source = new UrlAudioSource(this.context, "media/sweep.mp3", function() {
    document.getElementById("loading").style.display = 'none';
    document.getElementById("spectrum_analyzer").style.display = 'block';
    document.getElementById("controls").style.display = 'inline';
    application.audio = new Audio(application.source);
    application.model = new SpectrumAnalyzer(application.audio);
    application.view = new SpectrumAnalyzerView(application.model, "#spectrum_analyzer");
    application.view.update();
  });
}

Application.prototype.play = function() {
  this.model.play();
}

Application.prototype.setVolume = function(element) {
  this.audio.setVolume(element.value, element.max);  
}

Application.prototype.togglePlay = function() {
  this.audio.playing ? this.audio.stop() : this.play(); 
}

Application.prototype.stop = function() { 
  this.audio.stop();
}

Application.prototype.populateContext = function() {
  if (! window.AudioContext) {
	  if (! window.webkitAudioContext) {
      alert("Sorry, your browser is not supported.");
      return;
		}
		window.AudioContext = window.webkitAudioContext;
    this.context = new AudioContext();
  }
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

Application.togglePlay = function() {
  this.instance.togglePlay();
}

Application.stop = function() { 
  this.instance.stop();
}

