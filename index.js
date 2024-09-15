const express = require("express");
const path = require("path");
const fs = require("fs");
const { log } = require("console");

const app = express();
const PORT = 3000;

//Set-Up Parsers & EJS
app.set('view engine', 'ejs');

app.use( express.json() );
app.use( express.urlencoded( {extended: true} ));
app.use( express.static( path.join( __dirname, 'public') ));



app.get('/', (req, res) => {

    fs.readdir('./files', (err, files) => {
        res.render("index", {files: files});
    }); 
    
});

app.get('/files/:filename', (req, res) => {

    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {

        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file.");
        }

        res.render('show', {fileName: req.params.filename, filedata: filedata} );
        
    }); 
    
}); 

app.get('/edit/:filename', (req, res) => {

    res.render("edit", {filename: req.params.filename});
    
}); 

app.post('/edit', (req, res) => {

    const oldPath = path.join(__dirname, 'files', req.body.previous);
    const newPath = path.join(__dirname, 'files', req.body.new);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Error renaming file.");
        }

        res.redirect("/");
    });
});

app.post('/create', (req, res) => {

    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        res.redirect('/');
    });
    
});










app.listen(PORT, () => {
    console.log("Server Started/Re-Started !!");
});