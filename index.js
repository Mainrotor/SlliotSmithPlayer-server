const express = require("express");
var cors = require("cors");
const app = express();
const songRouter = require("./api/routers/song.js");
const usersRouter = require("./api/routers/users.js");
const playlistsRouter = require("./api/routers/playlists.js");
const albumsRouter = require("./api/routers/albums.js");

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.use("/song", songRouter);

app.use("/users", usersRouter);

app.use("/playlists", playlistsRouter);

app.use("/albums", albumsRouter);

app.use("/test", (req, res) => {
  res.json("test completed!");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`);
});
