// YouTube video ID
const videoID = "oY-H2WGThc8";
const myAudio = document.createElement('audio');
const audioContext = new AudioContext();
var myStream;
var mediaRecorder;


navigator.mediaDevices.enumerateDevices()
.then(function(devices) {
  devices.forEach(function(device) {
    console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
  });
})


function main() {
  // Fetch video info (using a proxy if avoid CORS errors)
  fetch('https://cors-anywhere.herokuapp.com/' + "https://www.youtube.com/get_video_info?video_id=" + videoID).then(response => {
    if (response.ok) {
      response.text().then(ytData => {
        // parse response to find audio info
        var ytData = parse_str(ytData);
        var getAdaptiveFormats = JSON.parse(ytData.player_response).streamingData.adaptiveFormats;
        var findAudioInfo = getAdaptiveFormats.findIndex(obj => obj.audioQuality);
        // get the URL for the audio file
        var audioURL = getAdaptiveFormats[findAudioInfo].url;


        console.log(myAudio);
        myAudio.setAttribute('src', audioURL);
        myAudio.currentTime = 5;


        const handleSuccess = function(stream) {
          console.log(stream);
          
          const ytsource = audioContext.createMediaElementSource(myAudio);
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(1024, 1, 1);
          const dst = audioContext.createMediaStreamDestination();
          mediaRecorder = new MediaRecorder(dst.stream);
          mediaRecorder.ondataavailable = function(evt) {
            // push each chunk (blobs) in an array
            console.log(evt.data);
            chunks.push(evt.data);
          };
     
          mediaRecorder.onstop = function(evt) {
            // Make blob out of our blobs, and open it.
            var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            document.querySelector("audio").src = URL.createObjectURL(blob);
          };
          
          
          var merger = audioContext.createChannelMerger(2);
          ytsource.connect(merger);
          source.connect(merger)
          merger.connect(processor);
          console.log(merger);
          processor.connect(audioContext.destination)
          
        };
      
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(handleSuccess);
      });

      

      
    }
  });
}
function start() {
  mediaRecorder.start();


  myAudio.play();
}

function stop() {
  mediaRecorder.stop();

  myAudio.pause();
}

function parse_str(str) {
  return str.split('&').reduce(function(params, param) {
    var paramSplit = param.split('=').map(function(value) {
      return decodeURIComponent(value.replace('+', ' '));
    });
    params[paramSplit[0]] = paramSplit[1];
    return params;
  }, {});
}
main()