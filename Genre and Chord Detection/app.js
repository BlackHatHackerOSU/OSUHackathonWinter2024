const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;


const bootstrapCSS = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });


const chordTranslations = {
    'LaAumentada': 'A#',
    'ReBemolMayor': 'D# Major',
    'SiMenor': 'B Minor',
    'SiBemolMenor': 'Bb Minor',
    'ReMayor': 'D Major',
    'FaMenor': 'F Minor',
    'SolMayor': 'G Major',
    'SolMenor': 'G Minor',
    'LaMenor': 'A Minor',
    'LaMayor': 'A Major',
    'DoMayor': 'C Major',
    'DoMenor': 'C Minor',
    'ReMenor': 'D Minor',
    'MiMenor': 'E Minor',
    'MiMayor': 'E Major',
    'Fa#Menor': 'F# Minor',
    'Fa#Mayor': 'F# Major',
    'Sol#Menor': 'G# Minor',
    'Sol#Mayor': 'G# Major',
    'La#Menor': 'A# Minor',
    'SiMayor': 'B Major',
    'FaMayor': 'F Major',
    'Do#Menor': 'C# Minor',
    'Do#Mayor': 'C# Major',
    'Re#Menor': 'D# Minor',
    'MiBemolMayor': 'Eb Major',
    'MiBemolMenor': 'Eb Minor',
    'SolBemolMayor': 'Gb Major',
    'SolBemolMenor': 'Gb Minor',
    'LaBemolMayor': 'Ab Major',
    'LaBemolMenor': 'Ab Minor',
    'SiBemolMayor': 'Bb Major',
    'Re#Mayor': 'D# Major',
    'FaBemolMayor': 'E Major', 
    'DoBemolMayor': 'B Major',
    'ReBemolAumentada': 'Db Augmented', 
    'DoAumentada': 'C Augmented', 
};


app.get('/', (req, res) => {
    res.render('index', { bootstrapCSS });
});

app.post('/upload', upload.single('audioFile'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('Please upload an audio file.');
    }

    const filePath = file.path;

    try {
        const data = fs.readFileSync(filePath);
        const apiUrl1 = "https://api-inference.huggingface.co/models/alejogil35/distilhubert-finetuned-chorddetection2";
        const apiUrl2 = "https://api-inference.huggingface.co/models/kajol/music_genre_classification01";
        const apiKey = "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";

        // First API call for chords
        const responseOne = await axios.post(apiUrl1, data, {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/octet-stream' }
        });

        // Second API call for genres
        const responseTwo = await axios.post(apiUrl2, data, {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/octet-stream' }
        });

        // Translate chord labels and prepare genre data
        const chords = responseOne.data.map(chord => ({
            score: chord.score,
            label: chordTranslations[chord.label] || chord.label
        }));

        // Assuming genre data does not need translation
        const genres = responseTwo.data;

        res.render('results', { chords, genres, bootstrapCSS });
    } catch (error) {
        console.error('Error processing the audio file:', error);
        res.status(500).send('Error processing the audio file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
