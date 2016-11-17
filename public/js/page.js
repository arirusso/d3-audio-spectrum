SA.Page = function() {}

SA.Page.prototype.showControls = function() {
  document.getElementById("controls").style.display = "inline";
}

SA.Page.prototype.showAnalyzer = function() {
  document.getElementById("spectrumAnalyzer").style.display = "block";
}

SA.Page.prototype.hideAudioSpinner = function() {
  document.getElementById("audioSpinner").style.display = "none";
}

SA.Page.prototype.showWidgetSpinner = function() {
  document.getElementById("widgetSpinner").style.display = "block";
}

SA.Page.prototype.hideWidgetSpinner = function() {
  document.getElementById("widgetSpinner").style.display = "none";
}

SA.Page.prototype.setInputSelectButtonText = function(value) {
  var element = document.getElementById("inputSelect");
  element.value = value;
}

SA.Page.prototype.setUrlInputValue = function(value) {
  var element = document.getElementById("audioUrl");
  element.value = value;
}

SA.Page.prototype.setPlayState = function(value) {
  var element = document.getElementById("play");
  var text = (value) ? "Stop" : "Play";
  element.value = text;
}
