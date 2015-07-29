window.onload = init("Sample3.mp3");
var context;
var buffer,source1,gainNode,input,filter,analyser,request,recorder,mediaStreamSource;
var startOffset = 0;
var startTime = 0;


function init(url) {

	context = new AudioContext();
	request = new XMLHttpRequest();
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

function LoadAudio(url) {
	request = new XMLHttpRequest();
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

/*function playSound(buffer) {
	var source1 = context.createBufferSource();
	source1.buffer = buffer;
	source1.connect(context.destination);
	source1.start(0);
}*/

function onError(e) {
  	console.error(e);
}



$(function() {
	// LoadAudio("Sample.mp3");
	$('#song1').click(function(event) {
		// LoadAudio("Sample.mp3");
		play(recorder, context);
		// playSound(buffer);
	});
	$('#song2').click(function(event) {
		pause();
		// playSound(buffer);
	});
	$('#rec').click(function(event) {
		playRec();
		// playSound(buffer);
	});
	$('#playrec').click(function(event) {
		playRec();
		// playSound(buffer);
	});
	$('#volume').change(function() {
		gainNode.gain.value = $('#volume').val() / 10;
	});

	var play = function(recorder,context) {
		startTime = context.currentTime;
		source1 = context.createBufferSource();
		// Connect graph
		source1.buffer = this.buffer;
		source1.loop = true;
		// Create a gain node.
		gainNode = context.createGain();
		// Connect the source to the gain node.
		source1.connect(gainNode);
		// Connect the gain node to the destination.
		gainNode.connect(context.destination);
		// source.connect(context.destination);
		// Start playback, but make sure we stay in bound of the buffer.
		playbackRecorderAudio(recorder, context);
		source1.start(0, startOffset % buffer.duration);
	}

	var pause = function() {
		source1.stop();
		// Measure how much time passed since the last pause.
		startOffset += context.currentTime - startTime;
	}
	var startRecorder = function(recorder) {
	    recorder.clear();
	    recorder.record();

	    $("a#record-toggle").text("Click to stop recording...");
	}

	var stopRecorder = function(recorder) {
	    recorder.stop();
	    $("a#record-toggle").text("Click me to re-record.");

	    recorder.exportWAV(function(wav) {
	      	var url = window.URL.createObjectURL(wav);
	      	$("audio#recorded-audio").attr("src", url);
	      	$("audio#recorded-audio").get()[0].load();
	    });
	}

	var playbackRecorderAudio = function (recorder, context) {
	    recorder.getBuffer(function (buffers) {
	      	var source2 = context.createBufferSource();
	      	source2.buffer = context.createBuffer(1, buffers[0].length, 44100);
	      	source2.buffer.getChannelData(0).set(buffers[0]);
	      	source2.buffer.getChannelData(0).set(buffers[1]);
	      	source2.connect(context.destination);
	      	source2.start(0);
	    });
	}

	var playRec = function () {
		navigator.webkitGetUserMedia({"audio": true}, function(stream) {
			// $("#shown").toggle();
		 	//    $("#hidden").toggle();

		    // var audioContext = new AudioContext();
		    mediaStreamSource = context.createMediaStreamSource( stream );
		    mediaStreamSource.connect( context.destination );

		    recorder = new Recorder(mediaStreamSource, {
		      	workerPath: "recorderWorker.js"
		    });
		    var recording = false;

		    $("a#record-toggle").click(function (e) {
		    	e.preventDefault();
		      	if (recording === false) {
			        startRecorder(recorder);
		        	recording = true;
		      	}	
		      	else {
		        	stopRecorder(recorder);
		        	recording = false;
		      	}
		    });

		    $("a#webaudio-playback").click(function (e) {
		    	e.preventDefault();
		      	playbackRecorderAudio(recorder, context);
		    })
		}, function(error) {
		    $("body").text("Error: you need to allow this sample to use the microphone.")
		});
	}
})
/*// Create the source.
var source = context.createBufferSource();
// Create the gain node.
var gain = context.createGain();
// Connect source to filter, filter to destination.
source.connect(gain);
gain.connect(context.destination);*/



/*function getLiveInput() {
	// Only get the audio stream.
	navigator.webkitGetUserMedia({audio: true}, onStream, onStreamError);
};

function onStream(stream) {
	// Wrap a MediaStreamSourceNode around the live input stream.
	input = context.createMediaStreamSource(stream);
	// Connect the input to a filter.
	filter = context.createBiquadFilter();
	filter.frequency.value = 60.0;
	filter.type = filter.NOTCH;
	filter.Q = 10.0;

	analyser = context.createAnalyser();

	// Connect graph.
	input.connect(filter);
	filter.connect(analyser);

	// Set up an animation.
	// requestAnimationFrame(render);
};

function onStreamError(e) {
  	console.error(e);
};

function playRec() {
	analyser.connect(context.destination);
	source.connect(input);
	source.start(0);
}*/
// function render() {
// 	// Visualize the live audio input.
// 	requestAnimationFrame(render);
// };
