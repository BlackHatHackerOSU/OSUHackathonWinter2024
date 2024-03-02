const Tab = function (notes) {
    this.notes = notes;
    this.$tabContainer = document.querySelector(".tab-container");
    this.$tab = document.querySelector(".tab");
  
    this.notes.$notesList.addEventListener("click", (event) => {
      const clickedNote = event.target.closest(".note");
      if (clickedNote) {
        this.generateTab(clickedNote.dataset);
      }
    });
  };
  
  Tab.prototype.generateTab = function (noteData) {
    const noteName = noteData.name;
    const noteFrequency = parseFloat(noteData.frequency);
    const noteOctave = parseInt(noteData.octave);
  
    function calculateTab(noteName, notefrequency, noteoctave) {
        const refFrequency = 440
        const semitonesA4 = Math.round(12 * Math.log2(notefrequency / referenceFrequency));
        const semitonesfromdesoct = semitonesFromA4 - 12 * (octave - 4);
        const midiNote = {
            "C": 60,
            "C#": 61,
            "D": 62,
            "D#": 63,
            "E": 64,
            "F": 65,
            "F#": 66,
            "G": 67,
            "G#": 68,
            "A": 69,
            "A#": 70,
            "B": 71
        }[noteName.toUpperCase()];
        const fretNumber = Math.round((semitonesFromDesiredOctave - midiNote + 69) % 12);

        const string = Math.ceil(fretNumber / 12);

        if (fretNumber < 0 || fretNumber > 24) {
        return "Note outside playable range";
        }
    return `${string}-${fretNumber}`;
    }
    
    const tabContent = calculateTab(noteName, noteFrequency, noteOctave);
  
    this.$tab.textContent = tabContent;
    this.$tabContainer.style.display = "block";

  };
  
