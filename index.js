const express = require("express");
const gitPullOrClone = require('git-pull-or-clone');
const fs = require("fs");
const uuid = require('uuid').v4;

const port = process.env.PORT || 3000;
const filePath = process.env.FILE_PATH || "./data"
const gitRepo = process.env.REPOSITORY;
const app = express();

// Check config
if (!gitRepo) {
    console.log("Config invalid");
    process.exit(1);
}

// Generate new trigger token on first launch
if (!fs.existsSync(filePath + "/token.txt")) {
    const newTrigger = uuid();
    fs.writeFileSync(filePath + "/token.txt", newTrigger);
    console.log("Trigger token generated: " + newTrigger)
}

// Update trigger endpoint
const trigger = fs.readFileSync(filePath + "/token.txt");
app.post("/" + trigger, (req, res) => {
    res.send("Ok");
    console.log("Updating files...");

    if (!fs.existsSync(filePath + "/public/index.html") && fs.existsSync(filePath + "/public")) {
        console.log("Initially cloning repo...")
        fs.rmSync(filePath + "/public", {
            recursive: true
        });
    }
    gitPullOrClone(gitRepo, filePath + "/public", (err) => {
        if (err) console.warn(err)
        console.log('Updated...')
    })
});

// Serve the static page
app.use(express.static(filePath + "/public"));

// 404 Page
app.get('*', function (req, res) {
    if (fs.existsSync(filePath + "/public/404.html")) {
        res.status(404).sendFile(filePath + "/public/404.html", {
            root: __dirname
        });
    } else {
        res.status(404).send("404 Not found!")
    }
});

// Start the server
app.listen(port, () => {
    console.log("Listening on http://localhost:" + port);
})