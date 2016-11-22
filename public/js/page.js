/*
  Web page where the spectrum analyzer is run
*/
SA.Page = function() {}

/*
  Display the spectrum analyzer controls on the page
*/
SA.Page.prototype.showControls = function() {
  document.getElementById("controls").style.display = "inline";
}

/*
  Display the spectrum analyzer on the page
*/
SA.Page.prototype.showAnalyzer = function() {
  document.getElementById("spectrumAnalyzer").style.display = "block";
}

/*
  Hide the spinner that signifies audio is loading
*/
SA.Page.prototype.hideAudioSpinner = function() {
  document.getElementById("audioSpinner").style.display = "none";
}

/*
  Show the spinner that signifies that the spectrum analyzer is initializing
*/
SA.Page.prototype.showWidgetSpinner = function() {
  document.getElementById("widgetSpinner").style.display = "block";
}

/*
  Hide the spinner that signifies that the spectrum analyzer is initializing
*/
SA.Page.prototype.hideWidgetSpinner = function() {
  document.getElementById("widgetSpinner").style.display = "none";
}

/*
  Set the text of the button used for input source select
*/
SA.Page.prototype.setInputSelectButtonText = function(value) {
  var element = document.getElementById("inputSelect");
  element.value = value;
}

/*
  Set the value of the audio URL input field
*/
SA.Page.prototype.setUrlInputValue = function(value) {
  var element = document.getElementById("audioUrl");
  element.value = value;
}

/*
  Set the playing state of the Application
*/
SA.Page.prototype.setPlayState = function(value) {
  var element = document.getElementById("play");
  var text = (value) ? "Stop" : "Play";
  element.value = text;
}
