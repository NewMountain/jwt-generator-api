const express = require("express");
const bodyParser = require("body-parser");
const R = require("ramda");
const uuidv4 = require("uuid/v4");

let app = express();
const port = 3001;

// Voodoo bullshit after wasting too much time on this:
// https://github.com/github/fetch/issues/323
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const jwtSecret = process.env["JWT_SECRET"] || "SUPER-DUPER-HYPER-MEGA-SECRET";

defaultRoute = "/api/jwt-generator/v1";
const mkRt = route => `${defaultRoute}${route}`;

app.get(mkRt("/generate-token"), (req, res) => {
  if (R.isNil(req.headers.user)) {
    res.status(400).json({ token: "Not provided without user header" });
  } else {
    const coll = app.db.collection("test_jwts");

    // TODO: Use async / await
    // TODO: Legit error handling
    // TODO: Should the user be allowed to have multiple tokens outstanding
    // TODO: Set expiration and clean Mongo

    // Delete all instances of that user
    coll.deleteMany({ user: req.headers.user }).then(() => {
      // Generate a new uuid
      const newId = uuidv4();
      // Set in Mongo
      coll.insertOne({ user: req.headers.user, token: newId }).then(() => {
        // On commit, give the users what they need
        res.json({ token: newId });
      });
    });
  }
});

app.post(mkRt("/verify-token"), (req, res) => {
  console.log(`Request on ${req.url}`);
  console.log(req.body);

  const coll = app.db.collection("test_jwts");

  coll.findOne({ user: req.body.user }).then(response => {
    let status;
    console.log(response);
    if (response.token === req.body.token) {
      status = "valid";
    } else {
      status = "invalid";
    }
    res.json({ tokenValidity: status });
  });
});

// Connect to Mongo here
// Connection URL
const url = process.env["MONGO_URL"] || "mongodb://localhost:27017";

// Database Name
const dbName = process.env["MONGO_JWT_DB"] || "dev_jwts";

module.exports = {
  app: app,
  port: port,
  conn: url,
  dbName: dbName
};
