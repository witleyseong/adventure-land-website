const express = require('express')
const data = require('better-sqlite3')
const path = require('path')
const PORT = 3000;
const app = express();


app.use(express.json())
app.use(express.static(path.join(__dirname, '..')))
app.use(express.urlencoded({ extended: true }))
const dbPath = path.join(__dirname, 'database', 'database.db');

const db = new data(dbPath)
console.log('connected with database')



db.prepare(`CREATE TABLE IF NOT EXISTS user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT CHECK(category IN('General Inquiry', 'Support', 'Feedback')) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL)`
).run();



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'))

})

app.get('/admin/data', (req,res) => {
    try{
        const rows = db.prepare(`SELECT * FROM user ORDER BY id DESC`).all();
        res.json(rows);
    }catch (err) {
        console.error('Error to retrive data',err)
        res.status(500).json({error: 'Error to find data'})
    }
})

app.post('/contact', (req, res) => {
    const { name, email, category, subject, message, Halloween } = req.body;

    const stmt = db.prepare(`INSERT INTO user(name, email, category, subject, message, Halloween)
    VALUES (?, ?, ?, ?, ?, ?)`);

    stmt.run(name, email, category, subject, message, Halloween || 'No');

    console.log('new contact saved', name, email, category)
    res.send('<h2>Message received! ✅</h2><a href="/index.html">Go back</a>')

})

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    const stmt = db.prepare(`SELECT * FROM admin WHERE email = ? AND password = ?`);
    const admin = stmt.get(email, password);

    if (admin) {
        res.json({ success: true})
    }else {
        res.json({ success: false, message: "Email or password incorrect!"})
    }
})

app.listen(PORT, () => console.log('Running at http://localhost:3000'))
