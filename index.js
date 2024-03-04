const express = require('express');
const os = require('os');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date()}`);
    next();
};

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to IRCTC Ticketing System" });
});

app.post('/users', upload.single('photo'), (req, res) => {
    const { age, location, tickets } = req.body;
    const user = {
        id: os.userInfo().uid,
        name: os.userInfo().username,
        age,
        location,
        photo: req.file.path,
        tickets
    };
    res.status(201).json({ user });
});

app.get('/users', (req, res) => {
  
    res.status(200).json({ users: [] });
});

app.get('/address-lookup/:url', (req, res) => {
    const { url } = req.params;

    fs.appendFile('IP.txt', `URL: ${url} IP Address: [IP Address] Family: [IPv4/IPv6]\n`, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Address lookup successful' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
