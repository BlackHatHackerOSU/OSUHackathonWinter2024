// document.getElementById('recordButton').addEventListener('click', function() {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(stream => {
//             const mediaRecorder = new MediaRecorder(stream);
//             let audioChunks = [];

//             mediaRecorder.addEventListener("dataavailable", event => {
//                 audioChunks.push(event.data);
//             });

//             mediaRecorder.addEventListener("stop", () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const formData = new FormData();
//                 formData.append("audioFile", audioBlob, "recording.wav");

//                 fetch("/upload", { method: "POST", body: formData })
//                     .then(response => response.json()) // Assuming your server responds with JSON
//                     .then(data => console.log(data))
//                     .catch(error => console.error(error));
//             });

//             if (mediaRecorder.state === "recording") {
//                 mediaRecorder.stop();
//             } else {
//                 audioChunks = [];
//                 mediaRecorder.start();
//                 // Update the button text to 'Stop Recording' or similar here if needed
//             }
//         })
//         .catch(error => console.error(error));
// });

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

document.getElementById("recordButton").addEventListener("click", function () {
  if (!isRecording) {
    // Start recording
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const formData = new FormData();
          formData.append("audioFile", audioBlob, "recording.wav");

          fetch("/upload", { method: "POST", body: formData })
            .then(async (response) => {
              if (!response.ok) {
                // If the server responded with a non-OK status, throw an error
                const errorText = await response.text();
                throw new Error(`Server returned an error: ${errorText}`);
              }
              const data = await response.json();
              if (data.message && data.message === "Model is loading") {
                // Display a message to the user about the model loading status
                alert(
                  `Model is loading. Please wait approximately ${data.estimatedTime} seconds before trying again.`
                );
              } else {
                console.log(data); // Process the successful response
              }
            })
            .catch((error) => {
              console.error("Fetch error:", error.message);
            });
        });

        mediaRecorder.start();
        isRecording = true;
        document.getElementById("recordButton").textContent = "Stop Recording";
      })
      .catch((error) => {
        console.error("getUserMedia error:", error);
      });
  } else {
    // Stop recording
    mediaRecorder.stop();
    isRecording = false;
    document.getElementById("recordButton").textContent = "Start Recording";
  }
});
