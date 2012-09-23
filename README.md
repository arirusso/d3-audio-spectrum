# Spectrum Analyzer Demo

See it here: http://d3-spectrum.herokuapp.com

This is a spectrum analyzer demo that I did for fun using the HTML5 Web Audio API, [dsp.js](https://github.com/corbanbrook/dsp.js) and [d3.js](http://d3js.org).

## Local Installation

There is a config.ru file included so that you can serve the project locally using [Rack](http://rack.github.com)

* Make sure rack is installed
* Clone the git repo

`      git clone git@github.com:arirusso/d3-audio-spectrum.git`

`      cd d3-audio-spectrum`

`      rackup config.ru`

* Open [http://localhost:9292](http://localhost:9292) in your browser

A frequency sweep mp3 is included for demo purposes but any audio file can be used.

