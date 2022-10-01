const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();

require("dotenv").config();

const PORT = 8000;

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "storage")));
app.use(express.static(__dirname + "/views v2/resources"));

app.set("views", ["./views", "./pages", "./views v2"]);
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("uploader (main)");
});

app.get("/v2", function(req, res) {
  fs.readdir("./storage", function(err, files) {
    if (err) {
      res.status(500).send(`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css">
      <body style='font-family: Calibri; margin: 20px;'>
        <h2 style="font-weight: 500;">Something went wrong ...</h2>
        <ul>
          <li><font>${err}</font></li>
        </ul>
        <div style="margin-top: 10px;">
          <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
        </div>
        <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
        <font>
      </body>`);
    } else {
      fs.readdir("./pages", function(err, pages) {
        if (err) {
          res.status(500).send(`
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css">
          <body style='font-family: Calibri; margin: 20px;'>
            <h2 style="font-weight: 500;">Something went wrong ...</h2>
            <ul>
              <li><font>${err}</font></li>
            </ul>
            <div style="margin-top: 10px;">
              <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
            </div>
            <div style="margin-top: 10px;">
                <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
              </div>
            <font>
          </body>`);
        } else {
          res.render("main", { items: files, pages: pages });
        }
      });
    }
  });
});

app.post("/upload", function(req, res) {
  const uploadedFile = req.files.file;
  const html = uploadedFile.name.includes(".html");
  const uploadPath = __dirname + "/storage/" + uploadedFile.name;
  const fileInfo = JSON.stringify(req.files);

  const includesUploader = uploadedFile.name.includes("uploader (main)");
  const includesResponse = uploadedFile.name.includes("response (main)");
  const includesListOfItems = uploadedFile.name.includes("list of items (main)");
  const includesListOfPages = uploadedFile.name.includes("list of pages (main)");

  if (includesUploader == true) {
    res.status(500).render("response (main)", { uploadPath: uploadPathEjs, serverResponse: "Something went wrong ... Unable to upload this file, File name contains This file contains inappropriate text ..." });
  } else {
    if (includesResponse == true) {
      res.status(500).render("response (main)", { uploadPath: uploadPathEjs, serverResponse: "Something went wrong ... Unable to upload this file, File name contains This file contains inappropriate text ..." });
    } else {
      if (includesListOfItems == true) {
        res.status(500).render("response (main)", { uploadPath: uploadPathEjs, serverResponse: "Something went wrong ... Unable to upload this file, File name contains This file contains inappropriate text ..." });
      } else {
        if (includesListOfPages == true) {
          res.status(500).render("response (main)", { uploadPath: uploadPathEjs, serverResponse: "Something went wrong ... Unable to upload this file, File name contains This file contains inappropriate text ..." });
        } else {
          if (html == true) {
            const splitExt = uploadedFile.name.split(".");
            const uploadPathEjs = __dirname + "/pages/" + splitExt[0] + ".ejs";

            uploadedFile.mv(uploadPathEjs, function(err) {
              if (err) {
                res.status(500).render("response (main)", { uploadPath: uploadPathEjs, serverResponse: err });
              } else {
                res.render("response (main)", { uploadPath: uploadPathEjs, serverResponse: fileInfo });
              }
            });
          } else {
            uploadedFile.mv(uploadPath, function(err) {
              if (err) {
                res.status(500).render("response (main)", { uploadPath: uploadPath, serverResponse: err });
              } else {
                res.render("response (main)", { uploadPath: uploadPath, serverResponse: fileInfo });
              }
            });
          }
        }
      }
    }
  }
});

app.get("/download", function(req, res) {
  storagePath = __dirname + "/storage/";
  res.download(storagePath + req.query.filename, function(err) {
    if (err) {
      res.status(500).send(`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
      <body style='font-family: Calibri; margin: 20px;'>
        <h2 style="font-weight: 500;">Couldn't find the ${req.query.filename}</h2>
        <ul>
          <li><font>${err}</font></li>
        </ul>
        <div style="margin-top: 10px;">
          <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
        </div>
        <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
        <font>
      </body>`);
    } else {
      console.log("A user downloaded", storagePath + req.query.filename);
    }
  });
});

app.get("/storageitems", function(req, res) {
  fs.readdir("./storage", function(err, files) {
    if (err) {
      res.status(500).send(`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
      <body style='font-family: Calibri; margin: 20px;'>
        <h2 style="font-weight: 500;">Something went wrong ...</h2>
        <ul>
          <li><font>${err}</font></li>
        </ul>
        <div style="margin-top: 10px;">
          <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
        </div>
        <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
        <font>
      </body>`);
    } else {
      res.render("list of items (main)", { items: files });
    }
  });
});

app.get("/preview", function(req, res) {
  res.sendFile(__dirname + "/storage/" + req.query.name, function(err) {
    if (err) {
      res.status(500).send(`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
      <body style='font-family: Calibri; margin: 20px;'>
        <h2 style="font-weight: 500;">Couldn't find the ${req.query.name}</h2>
        <ul>
          <li><font>${err}</font></li>
        </ul>
        <div style="margin-top: 10px;">
          <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
        </div>
        <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
        <font>
      </body>`);
    }
  });
});

app.get("/viewspages", function(req, res) {
  fs.readdir("./pages", function(err, files) {
    if (err) {
      res.status(500).send(`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
      <body style='font-family: Calibri; margin: 20px;'>
        <h2 style="font-weight: 500;">Something went wrong ...</h2>
        <ul>
          <li><font>${err}</font></li>
        </ul>
        <div style="margin-top: 10px;">
          <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
        </div>
        <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
        <font>
      </body>`);
    } else {
      res.render("list of pages (main)", { pages: files });
    }
  });
});

app.get("/page", function(req, res) {
  if (req.query.name.includes(".ejs")) {
    res.render(req.query.name, function(err) {
      if (err) {
        res.status(500).send(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
        <body style='font-family: Calibri; margin: 20px;'>
          <h2 style="font-weight: 500;">Couldn't find the ${req.query.name}.ejs</h2>
          <ul>
            <li><font>${err}</font></li>
          </ul>
          <div style="margin-top: 10px;">
            <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
          </div>
          <div style="margin-top: 10px;">
              <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
            </div>
          <font>
        </body>`);
      } else {
        res.render(req.query.name);
      }
    });
  } else {
    res.render(req.query.name, function(err) {
      if (err) {
        res.status(500).send(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
        <body style='font-family: Calibri; margin: 20px;'>
          <h2 style="font-weight: 500;">Couldn't find the ${req.query.name}.ejs</h2>
          <ul>
            <li><font>${err}</font></li>
          </ul>
          <div style="margin-top: 10px;">
            <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
          </div>
          <div style="margin-top: 10px;">
              <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
            </div>
          <font>
        </body>`);
      } else {
        res.render(req.query.name);
      }
    });
  }
});

app.get("/deletefile", function(req, res) {
  if (req.query.pass == process.env.server_pass) {
    fs.unlink("./storage/" + req.query.filename, function(err) {
      if (err) {
        res.status(500).send(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
        <body style='font-family: Calibri; margin: 20px;'>
          <h2 style="font-weight: 500;">Couldn't find the ${req.query.filename}</h2>
          <ul>
            <li><font>${err}</font></li>
          </ul>
          <div style="margin-top: 10px;">
            <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
          </div>
          <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
          <font>
        </body>`);
      } else {
        res.send(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
        <body style='font-family: Calibri; margin: 20px;'>
          <h2 style="font-weight: 500;">${req.query.filename}, was successfully deleted!</h2>
          <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
          <font>
        </body>
        `)
      }
    });
  } else {
    res.status(500).send(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
    <body style='font-family: Calibri; margin: 20px;'>
      <h2 style="font-weight: 500;">Invalid password ...</h2>
      <div style="margin-top: 10px;">
        <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
      </div>
      <div style="margin-top: 10px;">
        <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
      </div>
      <font>
    </body>`);
  }
});

app.get("/deletepage", function(req, res) {
  if (req.query.pass == process.env.server_pass) {
    fs.unlink("./pages/" + req.query.pagename, function(err) {
      if (err) {
        res.status(500).send(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
        <body style='font-family: Calibri; margin: 20px;'>
          <h2 style="font-weight: 500;">Couldn't find the ${req.query.pagename}</h2>
          <ul>
            <li><font>${err}</font></li>
          </ul>
          <div style="margin-top: 10px;">
            <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
          </div>
          <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
          <font>
        </body>`);
      } else {
        res.send(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
        <body style='font-family: Calibri; margin: 20px;'>
          <h2 style="font-weight: 500;">${req.query.pagename}, was successfully deleted!</h2>
          <div style="margin-top: 10px;">
            <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
          </div>
          <font>
        </body>
        `)
      }
    });
  } else {
    res.status(500).send(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css">
    <body style='font-family: Calibri; margin: 20px;'>
      <h2 style="font-weight: 500;">Invalid password ...</h2>
      <div style="margin-top: 10px;">
        <font style="color: darkgray; font-size: 14px;">Please try again ...</font>  
      </div>
      <div style="margin-top: 10px;">
        <button onclick='window.location.href = "https://cuploader.charlzk.repl.co/"'>Go back</button>
      </div>
      <font>
    </body>`);
  }
});

app.listen(PORT, function() {
  console.log("Express server is listening to ", PORT);
});