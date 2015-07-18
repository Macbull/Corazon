function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}
var audio_context;
var recorder;
var input;
var micstream;

var wavesurfer = Object.create(WaveSurfer);
function waveinit(){
	var options = {
			container     : document.querySelector('#waveform'),
			waveColor     : 'violet',
			progressColor : 'purple',
			loaderColor   : 'purple',
			cursorColor   : 'navy',
			markerWidth   : 2,
			audioContext : audio_context
	};

	if (location.search.match('scroll')) {
			options.minPxPerSec = 100;
			options.scrollParent = true;
	}

	if (location.search.match('normalize')) {
			options.normalize = true;
	}

	/* Progress bar */
	(function () {
			var progressDiv = document.querySelector('#progress-bar');
			var progressBar = progressDiv.querySelector('.progress-bar');

			var showProgress = function (percent) {
					progressDiv.style.display = 'block';
					progressBar.style.width = percent + '%';
			};

			var hideProgress = function () {
					progressDiv.style.display = 'none';
			};

			wavesurfer.on('loading', showProgress);
			wavesurfer.on('ready', hideProgress);
			wavesurfer.on('destroy', hideProgress);
			wavesurfer.on('error', hideProgress);
	}());

	// Init
	wavesurfer.init(options);
	// Load audio from URL
}
function wavemic(mediastreamsource){

	levelchecker = audio_context.createScriptProcessor(4096, 1 ,1);
	mediastreamsource.connect(levelchecker);
	levelchecker.connect(audio_context.destination)
	levelchecker.onaudioprocess = function(e){
		reloadBuffer(e);
	}

}
function reloadBuffer(event){
	wavesurfer.empty();
  wavesurfer.loadDecodedBuffer(event.inputBuffer);
}
function stopMic(){
	micstream.stop();
}
function startMic(){
	navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
		__log('No live audio input: ' + e);
	});
}
function startUserMedia(stream) {
	micstream = stream;
	input = audio_context.createMediaStreamSource(micstream);
	__log('Media stream created.');
	waveinit();
	wavemic(input);
	// Uncomment if you want the audio to feedback directly
	// input.connect(audio_context.destination);
	//__log('Input connected to audio context destination.');

	recorder = new Recorder(input);
	__log('Recorder initialised.');
}
function startRecording(button) {
	recorder && recorder.record();
	button.disabled = true;
	button.nextElementSibling.disabled = false;
	__log('Recording...');
	wavesurfer.container = document.querySelector('#waveform2');

}
function stopRecording(button) {
	recorder && recorder.stop();
	button.disabled = true;
	button.previousElementSibling.disabled = false;
	__log('Stopped recording.');

	// create WAV download link using audio data blob
	createDownloadLink();
	recorder.clear();
}
function createDownloadLink() {
	recorder && recorder.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
		var li = document.createElement('li');
		var au = document.createElement('audio');
		var hf = document.createElement('a');

		au.controls = true;
		au.src = url;
		hf.href = url;
		hf.download = new Date().toISOString() + '.wav';
		hf.innerHTML = hf.download;
		li.appendChild(au);
		li.appendChild(hf);
		recordingslist.appendChild(li);
	});
}
window.onload = function init() {
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		__log('Audio context set up.');
		__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch (e) {
		alert('No web audio support in this browser!');
	}


};
