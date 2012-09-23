# Spectrum Analyzer Demo

This is a spectrum analyzer demo using the HTML5 Web Audio API, [dsp.js](https://github.com/corbanbrook/dsp.js) and [d3.js](http://d3js.org).

![image](![https://lh4.googleusercontent.com/-FUyXg8iBPOU/UF9lFya59xI/AAAAAAAAAOc/42ZT4jswaa4/s800/screenshot.png])

A frequency sweep mp3 is included for demo purposes but any audio file can be used.

There is a config.ru file included so that you can serve the project locally using [Rack](http://rack.github.com)

## Installation

* Make sure rack is installed
* Clone the git repo

`      git clone git@github.com:arirusso/d3-audio-spectrum.git`

`      cd d3-audio-spectrum`

`      rackup config.ru`

* Open [http://localhost:9292](http://localhost:9292) in your browser

