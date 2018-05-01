

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } };//Chrome did not support the new constraints spec until 59 for video and 60 for audio



var video_var = location.search.substring(1).split("=");
var song_name = (video_var[1].split("."))[0];
song_name = song_name.replace("%E2%80%99", "");


var recBtn = document.querySelector('button#rec');
var pauseResBtn = document.querySelector('button#pauseRes');
var stopBtn = document.querySelector('button#stop');
// var downloadBtn = document.querySelector('button#download');


var videoElement = document.querySelectorAll('video')[1];
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('button#addtoRecordings');

var get_embed = document.getElementById("e1");

videoElement.controls = false;

function errorCallback(error){
	console.log('navigator.getUserMedia error: ', error);	
}


var mediaRecorder;
var chunks = [];
var count = 0;

function startRecording(stream) { /*creates a new media recorder*/
	display('Start recording...');
	if (typeof MediaRecorder.isTypeSupported == 'function'){
		/*
			MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
		*/
		if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		  var options = {mimeType: 'video/webm;codecs=vp9'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
		  var options = {mimeType: 'video/webm;codecs=h264'};
		} else  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
		  var options = {mimeType: 'video/webm;codecs=vp8'};
		}
		// display('Using '+options.mimeType);
		mediaRecorder = new MediaRecorder(stream, options);
	}else{
		display('isTypeSupported is not supported, using default codecs for browser');
		mediaRecorder = new MediaRecorder(stream);
	}

	pauseResBtn.textContent = "Pause"; /*Pause Button*/

	mediaRecorder.start();

	var url = window.URL || window.webkitURL;
	videoElement.src = url ? url.createObjectURL(stream) : stream;
	videoElement.play();

	mediaRecorder.ondataavailable = function(e) {
		chunks.push(e.data);
	};

	mediaRecorder.onerror = function(e){
		display('Error: ' + e);
	};


	mediaRecorder.onstart = function(){
		display('Started & state = ' + mediaRecorder.state);
	};

	mediaRecorder.onstop = function(){
		display('Stopped  & state = ' + mediaRecorder.state);

		var blob = new Blob(chunks, {type: "video/webm"});
		chunks = [];

		var videoURL = window.URL.createObjectURL(blob);
		// alert("stopped");
		downloadButton(videoURL);

		// downloadLink.href = videoURL;
		// videoElement.src = videoURL;
		// downloadLink.innerHTML = 'Download video file';


		var my_recording  = "my_" + song_name + "_recording";
		// var file_name = my_recording + ".webm";

		// downloadLink.setAttribute( "download", file_name);
		// downloadLink.setAttribute( "name", file_name);
		// addtoRecordings("left");
	};

	mediaRecorder.onpause = function(){
		display('Paused & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onresume = function(){
		display('Resumed  & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onwarning = function(e){
		display('Warning: ' + e);
	};
}


function onBtnRecordClicked (){
	 if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
		alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	}else {
		navigator.getUserMedia(constraints, startRecording, errorCallback);
		recBtn.disabled = true;
		pauseResBtn.disabled = false;
		stopBtn.disabled = false;
	}
}

function onBtnStopClicked(){
	mediaRecorder.stop();
	videoElement.controls = true;
	recBtn.disabled = false;
	pauseResBtn.disabled = true;
	stopBtn.disabled = true;
	// downloadButton(videoURL);
}

function onPauseResumeClicked(){
	if(pauseResBtn.textContent === "Pause"){
		console.log("pause");
		pauseResBtn.textContent = "Resume";
		mediaRecorder.pause();
		stopBtn.disabled = true;
	}else{
		console.log("resume");
		pauseResBtn.textContent = "Pause";
		mediaRecorder.resume();
		stopBtn.disabled = false;
	}
	recBtn.disabled = true;
	pauseResBtn.disabled = false;
}

function addtoRecordings(div){
	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "Video");
	var to_add = document.getElementById(div);
	var button = document.createElement("BUTTON");
    var button_name = document.createTextNode(my_recording);
    button.appendChild(button_name);
    button.setAttribute('data-recording', yourNewCmd);
    newDiv.appendChild(button)
    to_add.appendChild(newDiv);
}

function changeSource(video_file){
        var getVideo = document.getElementById("video1");
        var get_source = document.getElementById("source1");
        get_source.setAttribute("src", video_file);
        // get_source.setAttribute("")
        //SET ATTRIBUTE DATA OF 
        getVideo.load();
        return;
    }

function video_click(element){
	// document.getElementById("demo").innerHTML = my_recording;
      // var song_name = element.innerHTML;
      // var song_artist = song_name.split("-");
      // var video_name = song_artist[0];
      // video_name = video_name.toLowerCase();
      // video_name = video_name.replace(/ /g,"");
      // video_name = video_name.replace(/'/g, "");

      // video_file = video_name + ".mp4"
    changeSource(videoURL);
    return;
    }

function downloadButton(videoURL){
	var download_button = document.getElementById("addRecordings");
	download_button.style.display = "block";
	download_button.setAttribute("href", videoURL);
}

function add_recording(){
		downloadLink.setAttribute( "download", file_name);
		downloadLink.setAttribute( "name", file_name);


//SEE IF YOU CAN EDIT BUTTON DATA
//FOR NOW JUST DOWNLOAD THE FILE
//create a div
//create a button
//add button to div child
//add div to search_record
}
//   </div>    <div class="Video" align = "left" id = "s3">
//       <button class="button button1" onClick = "video_click(this);">The Only Exception - Paramore</button>      
// </div>


function display(message){
	dataElement.innerHTML = dataElement.innerHTML+'<br>'+message;
}

