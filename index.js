const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ayambakar',
    database: 'mahasiswa',
    port: 3309
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('Koneksi Berhasil');
});

app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM biodata', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.stack);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req, res) => {
    const { nama, agama, alamat } = req.body || {};
    
    if (!nama || !agama || !alamat) {
        return res.status(400).json({ message: 'Nama, agama, alamat wajib diisi' });
    }

    db.query(
        'INSERT INTO biodata (nama, agama, alamat) VALUES (?, ?, ?)',
        [nama, agama, alamat],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User created successfully' });
        }
    );
});

app.put('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, agama, alamat } = req.body;
    db.query(
        'UPDATE biodata SET nama = ?, agama = ?, alamat = ? WHERE id = ?',
        [nama, agama, alamat, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database Error' });
            }
            res.json({ message: 'User updated successfully' });
        }
    );
});



    
