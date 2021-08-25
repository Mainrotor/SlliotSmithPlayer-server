const express = require("express");
const songRouter = require("./routers/song.js");
const app = express();

const port = process.env.PORT || 3001;

app.get("/song", songRouter);

app.get("/", (req, res) => {
  res.send("welcome to our server");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`);
});
