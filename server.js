const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const PORT = 8000;

app.use(fileUpload());
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("uploader");
});

app.post("/upload", function(req, res) {
    uploadedFile = req.files.file;
    uploadPath = __dirname + "\\storage\\" + uploadedFile.name;
    const fileInfo = JSON.stringify(req.files)

    uploadedFile.mv(uploadPath, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.render("response", { uploadPath: uploadPath, fileInfo: fileInfo });
        }
    });
});

app.get("/download", function(req, res) {
    storagePath = __dirname + "\\storage\\";
    res.download(storagePath + req.query.filename);

    console.log("A user downloaded ", storagePath + req.query.filename);
});

app.listen(PORT, function() {
    console.log("Express server is listening to ", PORT);
});