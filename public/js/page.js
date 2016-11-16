Page = function() {}

Page.prototype.showControls = function() {
  document.getElementById("controls").style.display = "inline";
}

Page.prototype.showAnalyzer = function() {
  document.getElementById("spectrum_analyzer").style.display = "block";
}

Page.prototype.hideAudioSpinner = function() {
  document.getElementById("audio_spinner").style.display = "none";
}

Page.prototype.showWidgetSpinner = function() {
  document.getElementById("widget_spinner").style.display = "block";
}

Page.prototype.hideWidgetSpinner = function() {
  document.getElementById("widget_spinner").style.display = "none";
}

Page.prototype.setUrlInputValue = function(value) {
  var element = document.getElementById("input");
  element.value = value;
}

Page.prototype.setPlayState = function(value) {
  var element = document.getElementById("play");
  var text = (value) ? "Stop" : "Play";
  element.value = text;
}
