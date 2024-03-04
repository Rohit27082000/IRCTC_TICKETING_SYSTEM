const express = require("express");
const fs = require("fs");
const multer = require('multer');
const os = require("os");
const path = require("path");

const app = express();
app.use(express.json());

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date()}`);
    next();
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(logger);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to IRCTC Ticketing" });
});

app.post("/addUser", upload.single("avatar"), (req, res) => {
    const userInfo = os.userInfo();
    const uid = userInfo.uid;
    const username = userInfo.username;

    const { age, location, tickets } = req.body;
    const photoPath = req.file;

    const user = {
        id: uid,
        name: username,
        age,
        location,
        photo: photoPath,
        tickets
    };

    let data = {};
    try {
        data = JSON.parse(fs.readFileSync("db.json"));
    } catch (err) {
        console.log("Error:", err);
    }

    data.users = data.users || [];
    data.users.push(user);
    fs.writeFileSync("db.json", JSON.stringify(data));

    res.status(200).json({ message: "User added successfully", user });
});

app.get("/getUsers", (req, res) => {
    const data = JSON.parse(fs.readFileSync("db.json"));

    const users = data.users || [];
    res.status(200).json({ users });
});

app.get("/addressLookup/:website", (req, res) => {
    const website = req.params.website;

    const ip = '127.0.0.1';
    const family = 'IPv4';

    const log = `URL: ${website} IP Address: ${ip} Family: ${family}\n`;
    fs.appendFileSync('Ip.txt', log);

    res.status(200).json({ message: `Details for ${website} logged successfully.` });
});

app.listen(4500, () => {
    console.log("Server is running on port 4500");
});

module.exports = app;
