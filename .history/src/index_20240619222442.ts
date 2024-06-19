import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const DB_FILE_PATH = path.join(__dirname, 'db.json');

app.use(express.json());

// Ping endpoint
app.get('/ping', (req, res) => {
  res.send(true);
});

// Submit endpoint
app.post('/submit', (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const newEntry = { name, email, phone, github_link, stopwatch_time };

  fs.readFile(DB_FILE_PATH, 'utf8', (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    db.submissions.push(newEntry);

    fs.writeFile(DB_FILE_PATH, JSON.stringify(db), (err) => {
      if (err) throw err;
      res.send('Submission successful');
    });
  });
});

// Read endpoint
app.get('/read', (req, res) => {
  const index = parseInt(req.query.index as string, 10);

  fs.readFile(DB_FILE_PATH, 'utf8', (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    res.json(db.submissions[index]);
  });
});

// Delete endpoint
app.delete('/delete', (req, res) => {
  const index = parseInt(req.body.index, 10);

  fs.readFile(DB_FILE_PATH, 'utf8', (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    db.submissions.splice(index, 1);

    fs.writeFile(DB_FILE_PATH, JSON.stringify(db), (err) => {
      if (err) throw err;
      res.send('Deletion successful');
    });
  });
});

// Update endpoint
app.put('/update', (req, res) => {
  const { index, name, email, phone, github_link, stopwatch_time } = req.body;
  
  fs.readFile(DB_FILE_PATH, 'utf8', (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    db.submissions[index] = { name, email, phone, github_link, stopwatch_time };

    fs.writeFile(DB_FILE_PATH, JSON.stringify(db), (err) => {
      if (err) throw err;
      res.send('Update successful');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
