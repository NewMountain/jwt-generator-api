const server = require("./app.js");
let app = server.app;
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(server.conn)
  .then(client => {
    db = client.db(server.dbName); // whatever your database name is
    // Attach back express
    app.db = db;
    // Get the server listening
    app.listen(server.port, () => console.log(`Example app listening on port ${server.port}!`));
  })
  .catch(err => {
    console.log(err);
  });
