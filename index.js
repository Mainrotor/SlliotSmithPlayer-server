const express = require("express");
const bodyParser = require("body-parser");
const songRouter = require("./routers/song.js");

const app = express();
const port = process.env.PORT || 3001;

app.use("/song", songRouter);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`);
});
