const express = require("express");
const app = express();
const port = 3001;

defaultRoute = "/api/jwt-generator/v1";

const mkRt = route => `${defaultRoute}${route}`;

app.get(mkRt("/hello"), (req, res) => {
  console.log(`Request on ${req.url}`);
  res.send("Hello World!");
});

module.exports = {
  app: app,
  port: port
};
