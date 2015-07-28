window.onload = init;
var context;
var buffer,source,gainNode;
var startOffset = 0;
var startTime = 0;


function init() {
	context = new AudioContext();
}

function LoadAudio(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(theBuffer) {
	    	buffer = theBuffer;
	  	}, onError);
	}
	request.send();
}

function playSound(buffer) {
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start(0);
}

function onError(e) {
  	console.error(e);
}

function play() {
	startTime = context.currentTime;
	source = context.createBufferSource();
	// Connect graph
	source.buffer = this.buffer;
	source.loop = false;
	// Create a gain node.
	gainNode = context.createGain();
	// Connect the source to the gain node.
	source.connect(gainNode);
	// Connect the gain node to the destination.
	gainNode.connect(context.destination);
	// source.connect(context.destination);
	// Start playback, but make sure we stay in bound of the buffer.
	source.start(0, startOffset % buffer.duration);
}

function pause() {
	source.stop();
	// Measure how much time passed since the last pause.
	startOffset += context.currentTime - startTime;
}

$(function() {
	LoadAudio("Sample.mp3");
	$('#song1').click(function(event) {
		play();
		// playSound(buffer);
	});
	$('#song2').click(function(event) {
		pause();
		// playSound(buffer);
	});
	$('#volume').change(function() {
		gainNode.gain.value = $('#volume').val() / 10;
	});
})
/*// Create the source.
var source = context.createBufferSource();
// Create the gain node.
var gain = context.createGain();
// Connect source to filter, filter to destination.
source.connect(gain);
gain.connect(context.destination);*/



function getLiveInput() {
	// Only get the audio stream.
	navigator.webkitGetUserMedia({audio: true}, onStream, onStreamError);
};

function onStream(stream) {
	// Wrap a MediaStreamSourceNode around the live input stream.
	var input = context.createMediaStreamSource(stream);
	// Connect the input to a filter.
	var filter = context.createBiquadFilter();
	filter.frequency.value = 60.0;
	filter.type = filter.NOTCH;
	filter.Q = 10.0;

	var analyser = context.createAnalyser();

	// Connect graph.
	input.connect(filter);
	filter.connect(analyser);

	// Set up an animation.
	requestAnimationFrame(render);
};

function onStreamError(e) {
  	console.error(e);
};

function render() {
	// Visualize the live audio input.
	requestAnimationFrame(render);
};