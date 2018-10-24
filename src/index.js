const server = require("./app.js");
const app = server.app;

app.listen(server.port, () => console.log(`Example app listening on port ${server.port}!`));
