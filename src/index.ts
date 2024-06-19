import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

interface Submission {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
}

const dbPath = path.join(__dirname, 'db.json');

const readDB = (): Submission[] => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

const writeDB = (data: Submission[]) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

app.get('/ping', (req, res) => {
    res.json({ success: true });
});

app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const submissions = readDB();
    submissions.push({ name, email, phone, github_link, stopwatch_time });
    writeDB(submissions);
    res.json({ success: true });
});

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const submissions = readDB();
    if (index < 0 || index >= submissions.length) {
        res.status(404).json({ error: 'Submission not found' });
    } else {
        res.json(submissions[index]);
    }
});

app.put('/update', (req, res) => {
    const { index, name, email, phone, github_link, stopwatch_time } = req.body;
    const submissions = readDB();
    if (index < 0 || index >= submissions.length) {
        res.status(404).json({ error: 'Submission not found' });
    } else {
        submissions[index] = { name, email, phone, github_link, stopwatch_time };
        writeDB(submissions);
        res.json({ success: true });
    }
});

app.delete('/delete', (req, res) => {
    const { index } = req.body;
    const submissions = readDB();
    if (index < 0 || index >= submissions.length) {
        res.status(404).json({ error: 'Submission not found' });
    } else {
        submissions.splice(index, 1);
        writeDB(submissions);
        res.json({ success: true });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
