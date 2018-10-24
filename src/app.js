const express = require("express");
const bodyParser = require("body-parser");
const R = require("ramda");
const uuidv4 = require("uuid/v4");
var jwt = require("jsonwebtoken");
const moment = require("moment");

let app = express();
const port = 3001;
app.use(bodyParser.json());

const jwtSecret = process.env["JWT_SECRET"] || "SUPER-DUPER-HYPER-MEGA-SECRET";

defaultRoute = "/api/jwt-generator/v1";
const mkRt = route => `${defaultRoute}${route}`;

// ===========================================================================
//                                 ROUTES
// ===========================================================================

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
      // Make a timestamp
      const stamp = moment().format("YYYY-MM-DD hh:mm:ss a");
      // Set in Mongo
      const record = {
        user: req.headers.user,
        token: newId,
        timestamp: stamp
      };
      coll.insertOne(record).then(() => {
        // On commit, give the users what they need
        // Removing Mongo key
        // No leaking implementation details!
        const userJwt = jwt.sign(R.dissoc("_id", record), jwtSecret, { algorithm: "HS512" });
        res.json({ token: userJwt });
      });
    });
  }
});

app.post(mkRt("/verify-token"), (req, res) => {
  console.log(`Request on ${req.url}`);

  const coll = app.db.collection("test_jwts");

  coll.findOne({ user: req.body.user }).then(mongoResponse => {
    let status;
    const decodedObject = jwt.verify(req.body.token, jwtSecret, { algorithm: "HS512" });

    if (mongoResponse.token === decodedObject.token) {
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
