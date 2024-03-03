// app.js

global.window = {}; // Mock the window object
global.navigator = {}; // Mock the navigator object

// Mock the AudioContext
window.AudioContext = class {
  // Mock the methods and properties of AudioContext that you use
};

// Similarly, you can mock navigator.mediaDevices.getUserMedia
navigator.mediaDevices = {
  getUserMedia: async () => {
    // Return a mocked stream or simply resolve as it can't actually access the microphone
    return Promise.resolve();
  }
};

const Tuner = require('./tuner.js'); 
const Notes = require('./notes.js');
const Meter = require('./meter.js');


 class Application {
  constructor() {
    this.initA4();
    this.tuner = new Tuner(this.a4);
    this.notes = new Notes(".notes", this.tuner);
    this.meter = new Meter(".meter");
    this.frequencyBars = new FrequencyBars(".frequency-bars");
    this.update({
      name: "A",
      frequency: this.a4,
      octave: 4,
      value: 69,
      cents: 0,
    });
  }
  initA4() {
    if (typeof document !== "undefined") {
      this.$a4 = document.querySelector(".a4 span");
      this.a4 = parseInt(localStorage.getItem("a4")) || 440;
      this.$a4.innerHTML = this.a4;
    }
  }
  start() {
    const self = this;


    this.tuner.onNoteDetected = function (note) {
      if (self.notes.isAutoMode) {
        if (self.lastNote === note.name) {
          self.update(note);
        } else {
          self.lastNote = note.name;
        }
      }
    };

    swal.fire("Welcome to our Hackathon project!").then(function () {
      self.tuner.init();
      self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
    });

    this.$a4.addEventListener("click", function () {
      swal
        .fire({ input: "number", inputValue: self.a4 })
        .then(function ({ value: a4 }) {
          if (!parseInt(a4) || a4 === self.a4) {
            return;
          }
          self.a4 = parseInt(a4); // Ensure a4 is always an integer
          self.$a4.innerHTML = a4;
          self.tuner.middleA = a4; // Update tuner's A4
          self.notes.createNotes(); // Recreate notes with new A4
          self.update({
            name: "A",
            frequency: self.a4,
            octave: 4,
            value: 69,
            cents: 0,
          });
          localStorage.setItem("a4", a4.toString());
        });
    });

    this.updateFrequencyBars();

    document.querySelector(".auto input").addEventListener("change", () => {
      this.notes.toggleAutoMode();
    });
  }
  updateFrequencyBars() {
    if (this.tuner.analyser) {
      this.tuner.analyser.getByteFrequencyData(this.frequencyData);
      this.frequencyBars.update(this.frequencyData);
    }
    requestAnimationFrame(this.updateFrequencyBars.bind(this));
  }
  update(note) {
    this.notes.update(note);
    this.meter.update((note.cents / 50) * 45);
  }
}





const app = new Application();
app.start();
