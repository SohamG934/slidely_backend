import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'submissions.json');

app.use(express.json());

// Ensure the file exists and initialize it if it doesn't
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ submissions: [] }), 'utf-8');
}

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading submissions file.');
        } else {
            const db = JSON.parse(data);
            if (index >= 0 && index < db.submissions.length) {
                res.json(db.submissions[index]);
            } else {
                res.status(404).send('Submission not found.');
            }
        }
    });
});

app.post('/submit', (req, res) => {
    const newSubmission = req.body;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading submissions file.');
        } else {
            const db = JSON.parse(data);
            db.submissions.push(newSubmission);
            fs.writeFile(filePath, JSON.stringify(db, null, 2), 'utf-8', (writeErr) => {
                if (writeErr) {
                    res.status(500).send('Error writing to submissions file.');
                } else {
                    res.status(201).send('Submission added.');
                }
            });
        }
    });
});

app.put('/update', (req, res) => {
    const { index, name, email, phone, github_link, stopwatch_time } = req.body;
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading submissions file.');
            return;
        }
        
        const db = JSON.parse(data);
        
        if (!Array.isArray(db.submissions)) {
            res.status(500).send('Submissions data is corrupted.');
            return;
        }
        
        if (index < 0 || index >= db.submissions.length) {
            res.status(404).send('Submission not found.');
            return;
        }
        
        db.submissions[index] = { name, email, phone, github_link, stopwatch_time };
        
        fs.writeFile(filePath, JSON.stringify(db, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error writing to submissions file.');
            } else {
                res.status(200).send('Submission updated successfully.');
            }
        });
    });
});

app.delete('/delete', (req, res) => {
    const { index } = req.body;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading submissions file.');
        } else {
            const db = JSON.parse(data);
            if (index >= 0 && index < db.submissions.length) {
                db.submissions.splice(index, 1);
                fs.writeFile(filePath, JSON.stringify(db, null, 2), 'utf-8', (writeErr) => {
                    if (writeErr) {
                        res.status(500).send('Error writing to submissions file.');
                    } else {
                        res.status(200).send('Submission deleted.');
                    }
                });
            } else {
                res.status(404).send('Submission not found.');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
