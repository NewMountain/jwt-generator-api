const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.json());

const jwtSecret = process.env["JWT_SECRET"] || "SUPER-DUPER-HYPER-MEGA-SECRET";

defaultRoute = "/api/jwt-generator/v1";
const mkRt = route => `${defaultRoute}${route}`;

app.get(mkRt("/generate-token"), (req, res) => {
  console.log(`Request on ${req.url}`);
  res.json({ token: "Hello World!" });
});

app.post(mkRt("/verify-token"), (req, res) => {
  console.log(`Request on ${req.url}`);
  res.json({ tokenValidity: "verified" });
});

module.exports = {
  app: app,
  port: port
};
