const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let data = {
    choices: [],
    dates: []
};

// Load existing data from file (if any)
try {
    const rawData = fs.readFileSync('data.json');
    data = JSON.parse(rawData);
} catch (error) {
    console.log("No existing data found, starting fresh.");
}

app.post('/api/submit-choices', (req, res) => {
    const { name, email, choices } = req.body;
    console.log(req.body); // Log de ontvangen data

    // Controleer of choices een array is
    if (!Array.isArray(choices)) {
        return res.status(400).json({ message: 'Choices must be an array' });
    }

    // Zoek naar bestaande gebruiker
    const existingUserIndex = data.choices.findIndex(userChoice => userChoice.email === email);

    if (existingUserIndex !== -1) {
        // Update bestaande gebruiker
        data.choices[existingUserIndex].choices = choices;
    } else {
        // Voeg nieuwe gebruiker toe
        const userChoice = { name, email, choices };
        data.choices.push(userChoice);
    }

    // Save data to file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2)); // Formatteer JSON voor leesbaarheid

    res.json({ message: 'Keuzes zijn ontvangen!' });
});

app.get('/api/get-dates', (req, res) => {
    res.json(data.dates);
});

app.post('/api/set-dates', (req, res) => {
    const { startDate, endDate } = req.body;
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]); // Store as 'YYYY-MM-DD'
        currentDate.setDate(currentDate.getDate() + 1);
    }

    data.dates = dates;

    // Save dates to file
    fs.writeFileSync('data.json', JSON.stringify(data));

    res.json({ message: 'Datums zijn ingesteld!', dates });
});

app.get('/api/get-summary', (req, res) => {
    const summary = data.dates.map(date => {
        const counts = { green: 0, yellow: 0, red: 0 };
        data.choices.forEach(choice => {
            const userChoice = choice.choices.find(c => c.date === date);
            if (userChoice) {
                counts[userChoice.choice]++;
            }
        });
        return { date, counts };
    });
    res.json(summary);
});

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});


// Verwijder duplicaten
let uniqueChoices = [];
let emails = new Set();

data.choices.forEach(choice => {
    if (!emails.has(choice.email)) {
        uniqueChoices.push(choice);
        emails.add(choice.email);
    }
});

data.choices = uniqueChoices;

// Save cleaned data to file
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));