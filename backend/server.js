const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const db = mysql.createConnection({
  host: '37.27.71.198',
  user: 'mvhinnlf_donationtest',
  password: '@susK53sd',
  database: 'mvhinnlf_donationform'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/donation-form', upload.single('receipt'), (req, res) => {
  const { name, email, city, amount } = req.body;
  const receipt = req.file;

  if (!name || !email || !city || !amount || !receipt) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO donations (name, email, city, amount, receipt) VALUES (?, ?, ?, ?, ?)';
  const values = [name, email, city, amount, receipt.filename];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Failed to insert donation:', err);
      return res.status(500).json({ error: 'Failed to submit donation' });
    }
    res.status(200).json({ message: 'Donation received successfully' });
  });
});

app.use('/uploads', express.static(uploadDir));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
