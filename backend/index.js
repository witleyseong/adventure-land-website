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

app.post('/contact', (req,res) => {
    const {name, email, category, subject, message} = req.body;

    const stmt = db.prepare(`INSERT INTO user(name, email, category, subject, message) VALUES(?,?,?,?,?)`);
    stmt.run(name, email, category, subject, message);
    console.log('new contact saved', name, email, category)
    res.send('<h2>Message received! ✅</h2><a href="/contact.html">Go back</a>')

})

app.listen(PORT, () => console.log('Servidor rodando em http://localhost:3000'))
