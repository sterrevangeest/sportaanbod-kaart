console.log("test");

const express = require("express");
const app = express();
const port = 3000;
const request = require("request");
let ejs = require("ejs");
app.use(express.static("static"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("yo");
  res.render("index");
});

var http = require("http");

var data = "data to send to client";

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
