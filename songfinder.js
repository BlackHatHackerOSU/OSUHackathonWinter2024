const songfinder = function() {
    this.initGetUserMedia;
 };
 
 songfinder.prototype.initGetUserMedia = function () {
   window.AudioContext = window.AudioContext || window.webkitAudioContext;
   if (!window.AudioContext) {
     return alert("AudioContext not supported");
   }
 
   // Older browsers might not implement mediaDevices at all, so we set an empty object first
   if (navigator.mediaDevices === undefined) {
     navigator.mediaDevices = {};
   }
 
   // Some browsers partially implement mediaDevices. We can't just assign an object
   // with getUserMedia as it would overwrite existing properties.
   // Here, we will just add the getUserMedia property if it's missing.
   if (navigator.mediaDevices.getUserMedia === undefined) {
     navigator.mediaDevices.getUserMedia = function (constraints) {
       // First get ahold of the legacy getUserMedia, if present
       const getUserMedia =
         navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 
       // Some browsers just don't implement it - return a rejected promise with an error
       // to keep a consistent interface
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
 
   navigator.mediaDevices
     .getUserMedia({ audio: true })
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
         self.sendDataToAPI(recordedBlob); // Call function to send data
       };
 
       self.mediaRecorder = mediaRecorder; // Store the recorder instance for later access
       self.mediaRecorder.start(); // Start recording
     })
     // Closing parenthesis added here, as it was missing previously
     .catch(function (error) {
       console.error("Error accessing media devices:", error);
       // Handle errors gracefully, e.g., inform the user
     });
 };
 
 
 songfinder.prototype.handleStopButtonClick = function () {
   if (this.mediaRecorder) {
     this.mediaRecorder.stop();
   }
 };
 
 // Replace with your actual function to parse song titles from the API response
 function parseSongTitlesFromResponse(responseData) {
   // Implement logic to extract song titles from the response data format
   // This function needs to be replaced with your specific parsing logic
   // based on the actual response format from the Gemini API
   return [];
 }
 
 songfinder.prototype.init = function () {
   this.startRecord();
 };