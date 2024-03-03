async function getChordData(instrument, note, chord) {
    try {
        // Adjust the relative path as necessary for your project
        const chordModule = await import(`./chordsrc/db/${instrument}/chords/${note}/${chord}.js`);
        return chordModule.default;
    } catch (error) {
        console.error("Error loading chord data:", error);
        return null; // Handle the error as appropriate for your application
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const instrumentSelect = document.getElementById('instrument-select');
    const keySelect = document.getElementById('key-select');
    const suffixSelect = document.getElementById('suffix-select');
    const generateChordButton = document.getElementById('generate-chord');
    const chordDiagram = document.getElementById('chord-diagram');

    // Populate the instrument dropdown
    ['guitar', 'ukulele'].forEach(instrument => {
        let option = document.createElement('option');
        option.value = instrument;
        option.textContent = instrument.charAt(0).toUpperCase() + instrument.slice(1);
        instrumentSelect.appendChild(option);
    });

    // Populate the key dropdown
    const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    keys.forEach(key => {
        let option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        keySelect.appendChild(option);
    });

    // Populate the suffix dropdown
    const suffixes = ['major', 'minor', '7', 'm7', 'maj7'];
    suffixes.forEach(suffix => {
        let option = document.createElement('option');
        option.value = suffix;
        option.textContent = suffix;
        suffixSelect.appendChild(option);
    });

    // Event listener for the 'Generate Chord' button
    generateChordButton.addEventListener('click', async () => {
        const selectedInstrument = instrumentSelect.value;
        const selectedKey = keySelect.value;
        const selectedSuffix = suffixSelect.value;

        // Retrieve the chord data based on selected key and suffix
        const chordData = await getChordData(selectedInstrument, selectedKey, selectedSuffix);
        if (chordData) {
            const numStrings = selectedInstrument === 'Ukelele' ? 4 : 6;
            generateSvgChordDiagram(chordData, numStrings);
        } else {
            console.log(`No chord data found for ${selectedKey} ${selectedSuffix}`);
        }
    });
});


function generateSvgChordDiagram(chordData, numStrings) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const chordDiagram = document.getElementById('chord-diagram');
    chordDiagram.innerHTML = ''; // Clear previous diagrams

    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", "220");
    svg.setAttribute("height", "260");
    svg.setAttribute("viewBox", "0 0 110 130");

    // Constants for diagram drawing
    const stringSpacing = 15;
    const fretSpacing = 20;
    const startFretX = 10;
    const startFretY = 30;
    const numFrets = 5;
    const circleRadius = 5;

    // Draw strings
    for (let i = 0; i < numStrings; i++) {
        const line = document.createElementNS(svgNamespace, "line");
        line.setAttribute("x1", startFretX + i * stringSpacing);
        line.setAttribute("y1", startFretY);
        line.setAttribute("x2", startFretX + i * stringSpacing);
        line.setAttribute("y2", startFretY + fretSpacing * (numFrets - 1));
        line.setAttribute("stroke", "black");
        svg.appendChild(line);
    }

    // Draw frets
    for (let i = 0; i < numFrets; i++) {
        const line = document.createElementNS(svgNamespace, "line");
        line.setAttribute("x1", startFretX);
        line.setAttribute("y1", startFretY + i * fretSpacing);
        line.setAttribute("x2", startFretX + stringSpacing * (numStrings - 1));
        line.setAttribute("y2", startFretY + i * fretSpacing);
        line.setAttribute("stroke", "black");
        svg.appendChild(line);
    }

    // Assuming we're rendering the first position for simplicity
    const position = chordData.positions[0];

    // Draw fingers and barres
    position.frets.split('').forEach((fret, string) => {
        if (fret === 'x') {
            // Draw 'X' for muted strings
            drawText(svg, svgNamespace, startFretX + string * stringSpacing, startFretY - 10, "X");
        } else if (fret === '0') {
            // Draw 'O' for open strings
            drawText(svg, svgNamespace, startFretX + string * stringSpacing, startFretY - 10, "O");
        } else {
            // Draw circle for finger position
            const circle = document.createElementNS(svgNamespace, "circle");
            circle.setAttribute("cx", startFretX + string * stringSpacing);
            circle.setAttribute("cy", startFretY + (fret - 1) * fretSpacing + fretSpacing / 2);
            circle.setAttribute("r", circleRadius);
            circle.setAttribute("fill", "red");
            svg.appendChild(circle);
        }
    });

    // Handle barre chords if any
    if (position.barres) {
        const barre = position.barres; // Assuming single barre for simplicity
        const barreFret = parseInt(barre, 10) - 1; // Adjust barre fret position
        const barreWidth = stringSpacing * (numStrings - 1);
        const barreHeight = 6; // Height of the barre chord representation

        const rect = document.createElementNS(svgNamespace, "rect");
        rect.setAttribute("x", startFretX);
        rect.setAttribute("y", startFretY + barreFret * fretSpacing + (fretSpacing / 2) - (barreHeight / 2));
        rect.setAttribute("width", barreWidth);
        rect.setAttribute("height", barreHeight);
        rect.setAttribute("fill", "grey");
        svg.appendChild(rect);
    }

    chordDiagram.appendChild(svg);
}

function drawText(svg, svgNamespace, x, y, textContent) {
    const text = document.createElementNS(svgNamespace, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "10");
    text.setAttribute("font-family", "Arial");
    text.textContent = textContent;
    svg.appendChild(text);
}
