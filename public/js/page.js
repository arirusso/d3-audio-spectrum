Page = function() {}

Page.prototype.showControls = function() {
  document.getElementById("controls").style.display = "inline";
}

Page.prototype.showAnalyzer = function() {
  document.getElementById("spectrumAnalyzer").style.display = "block";
}

Page.prototype.hideAudioSpinner = function() {
  document.getElementById("audioSpinner").style.display = "none";
}

Page.prototype.showWidgetSpinner = function() {
  document.getElementById("widgetSpinner").style.display = "block";
}

Page.prototype.hideWidgetSpinner = function() {
  document.getElementById("widgetSpinner").style.display = "none";
}

Page.prototype.setInputSelectButtonText = function(value) {
  var element = document.getElementById("inputSelect");
  element.value = value;
}

Page.prototype.setUrlInputValue = function(value) {
  var element = document.getElementById("audioUrl");
  element.value = value;
}

Page.prototype.setPlayState = function(value) {
  var element = document.getElementById("play");
  var text = (value) ? "Stop" : "Play";
  element.value = text;
}
