class Notes {
  constructor(selector, tuner) {
    this.tuner = tuner;
    this.isAutoMode = true;
    this.$root = document.querySelector(selector);
    this.$notesList = this.$root.querySelector(".notes-list");
    this.$frequency = this.$root.querySelector(".frequency");
    this.$notes = [];
    this.$notesMap = {};
    this.createNotes();
    this.$notesList.addEventListener("touchstart", (event) => event.stopPropagation()
    );
  }
  createNotes() {
    this.$notesList.innerHTML = "";
    const minOctave = 1;
    const maxOctave = 8;
    for (var octave = minOctave; octave <= maxOctave; octave += 1) {
      for (var n = 0; n < 12; n += 1) {
        const $note = document.createElement("div");
        $note.className = "note";
        $note.dataset.name = this.tuner.noteStrings[n];
        $note.dataset.value = 12 * (octave + 1) + n;
        $note.dataset.octave = octave.toString();
        $note.dataset.frequency = this.tuner.getStandardFrequency(
          $note.dataset.value
        );
        $note.innerHTML =
          $note.dataset.name[0] +
          '<span class="note-sharp">' +
          ($note.dataset.name[1] || "") +
          "</span>" +
          '<span class="note-octave">' +
          $note.dataset.octave +
          "</span>";
        this.$notesList.appendChild($note);
        this.$notes.push($note);
        this.$notesMap[$note.dataset.value] = $note;
      }
    }

    const self = this;
    this.$notes.forEach(function ($note) {
      $note.addEventListener("click", function () {
        if (self.isAutoMode) {
          return;
        }

        const $active = self.$notesList.querySelector(".active");
        if ($active === this) {
          self.tuner.stopOscillator();
          $active.classList.remove("active");
        } else {
          self.tuner.play(this.dataset.frequency);
          self.update($note.dataset);
        }
      });
    });
  }
  active($note) {
    this.clearActive();
    $note.classList.add("active");
    this.$notesList.scrollLeft =
      $note.offsetLeft - (this.$notesList.clientWidth - $note.clientWidth) / 2;
  }
  clearActive() {
    const $active = this.$notesList.querySelector(".active");
    if ($active) {
      $active.classList.remove("active");
    }
  }
  update(note) {
    if (note.value in this.$notesMap) {
      this.active(this.$notesMap[note.value]);
      this.$frequency.childNodes[0].textContent = parseFloat(
        note.frequency
      ).toFixed(1);
    }
  }
  toggleAutoMode() {
    if (!this.isAutoMode) {
      this.tuner.stopOscillator();
    }
    this.clearActive();
    this.isAutoMode = !this.isAutoMode;
  }
}
  
  
  
module.exports = Notes;
  
