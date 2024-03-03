const songfinder = function() {
  this.initGetUserMedia();
};

songfinder.prototype.initGetUserMedia = function () {
 window.AudioContext = window.AudioContext || window.webkitAudioContext;
 if (!window.AudioContext) {
   return alert("AudioContext not supported");
 }

 if (navigator.mediaDevices === undefined) {
   navigator.mediaDevices = {};
 }

 if (navigator.mediaDevices.getUserMedia === undefined) {
   navigator.mediaDevices.getUserMedia = function (constraints) {
     const getUserMedia =
       navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    
     if (!getUserMedia) {
       alert("getUserMedia is not implemented in this browser");
     }

     return new Promise(function (resolve, reject) {
       getUserMedia.call(navigator, constraints, resolve, reject);
     });
   };
 }
};

songfinder.prototype.startRecord = function () {
const self = this;
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        self.recordedData = [];
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                self.recordedData.push(event.data);
            }
        };

        mediaRecorder.onstop = function () {
            const recordedBlob = new Blob(self.recordedData, { type: 'audio/wav' });
            self.sendDataToAPI(recordedBlob);
            self.recordedData = [];
        };

        self.mediaRecorder = mediaRecorder;
        self.mediaRecorder.start();
        console.log("recording");
    })
    .catch(function (error) {
        console.error("Error accessing media devices:", error);
    });
};

songfinder.prototype.stopRecord = function () {
const self = this;

if (self.mediaRecorder && self.mediaRecorder.state === 'recording') {
    self.mediaRecorder.stop();

    const tracks = self.mediaRecorder.stream.getTracks();
    tracks.forEach(track => track.stop());
} else {
    console.error('MediaRecorder is not in the recording state.');
}
};


songfinder.prototype.sendDataToAPI = function(recordedBlob) {
const self = this;
const apiUrl = "https://api.openai.com/v1/audio/transcriptions" ;

// Reference to the textarea where the API output will be displayed
const apiOutputTextarea = document.getElementById('apiOutput');

const formData = new FormData();
formData.append('file', recordedBlob, 'audio.wav');
formData.append('model', 'whisper-1'); 
formData.append('language', 'en'); 
formData.append('response_format', 'json');

fetch(apiUrl, {
    method: 'POST',
    body: formData,
    headers: {
        'Authorization': `Bearer ${'your-api-key'}`,
    },
})
.then(response => response.json())
.then(data => {
  const transcribedText = data.text;
  self.sendTextToAPI(transcribedText);
  //apiOutputTextarea.value = transcribedText;

  
})    
.catch(error => {
    console.error('Error sending data to API:', error);

    // Display the error message in the textarea
    apiOutputTextarea.value = `Error: ${error.message}`;
});
};

songfinder.prototype.sendTextToAPI = function(transcribedText) {
const self = this;

const apiUrl = "https://api.openai.com/v1/chat/completions";
const apiOutputTextarea = document.getElementById('apiOutput');
const requestData = {
  messages: [
    {
      role: 'user',
          content: `Using these lyrics: "${transcribedText}". Find 5 similar songs with similar artists. Respond in this format: 
          1. Song Name by Artist
          2. Song Name by Artist
          3. Song Name by Artist
          4. Song Name by Artist
          5. Song Name by Artist`,          
    },
  ],
  model: 'gpt-3.5-turbo',
  n: 1,
  max_tokens: 50,
  stop: null,
};

fetch(apiUrl, {
  method: 'POST',
  body: JSON.stringify(requestData),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${'your-api-key'}`, 
  },
})
  .then(response => response.json())
  .then(data => {
    const generatedResponse = data.choices[0].message.content;
    
    apiOutputTextarea.value = generatedResponse;
  })
  .catch(error => {
    console.error('Error sending text to API:', error);
    apiOutputTextarea.value = `Error: ${error.message}`;
  });
};
