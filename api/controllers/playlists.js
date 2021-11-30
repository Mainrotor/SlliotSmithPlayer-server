const mysql = require("mysql");
const pool = require("../../sql/connection");
const { handleSQLError } = require("../../sql/error");

const getPlaylist = (req, res) => {
  let sql =
    "SELECT playlists.title, users.username FROM playlists inner join users on playlists.userID = users.userID where users.userID = ? and playlists.playlistID = ?";
  sql = mysql.format(sql, [req.params.userID, req.params.playlistID]);

  pool.query(sql, (err, rows) => {
    if (err) {
      return res.json({ success: "invalid-playlist" });
    }
    return res.json(rows);
  });
};

const renamePlaylist = (req, res) => {
  if (req.user.user === req.body.userID) {
    let sql = "UPDATE playlists SET title = ? WHERE playlistID = ?";
    sql = mysql.format(sql, [req.body.title, req.body.playlistID]);

    pool.query(sql, (err, rows) => {
      if (err) {
        return res.json({ success: "Error renaming" });
      }
      return res.json({ success: "Playlist renamed" });
    });
  } else return res.json({ success: "invalid-auth" });
};

const deletePlaylist = (req, res) => {
  if (req.user.user === req.body.userID) {
    let sql = "delete from playlists where playlistID = ?";

    sql = mysql.format(sql, req.params.playlistID);

    pool.query(sql, (err, rows) => {
      if (err) {
        return res.json({ success: "Could not delete playlist" });
      }
      return res.json({ success: "playlist-deleted" });
    });
  } else return res.json({ success: "invalid-auth" });
};

const addSong = (req, res) => {
  if (req.user.user === req.body.userID) {
    let sql =
      "INSERT INTO playlist_songs (orderID, playlistID, song_ID, userID) SELECT (CASE when Max(orderID) IS NOT NULL then Max(orderID) + 1 else 1 END), ?, ?, ? FROM playlist_songs WHERE playlistID = ?";

    sql = mysql.format(sql, [
      req.body.playlistID,
      req.body.songID,
      req.body.userID,
      req.body.playlistID,
    ]);

    pool.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ success: "fail" });
      }
      return res.json({ success: "success" });
    });
  } else {
    return res.json({ succcess: "invalid-auth" });
  }
};

const deleteSong = (req, res) => {
  if (req.user.user === req.body.userID) {
    let sql =
      "DELETE FROM playlist_songs where orderID = ? and playlistID = ? and song_ID = ? and userID = ?";

    sql = mysql.format(sql, [
      req.body.orderID,
      req.body.playlistID,
      req.params.songID,
      req.body.userID,
    ]);

    pool.query(sql, (err, rows) => {
      if (err) {
        return res.json({ success: "error-deleting" });
      }
      sql =
        " UPDATE playlist_songs t1 SET orderID = orderID - 1 WHERE orderID > ? AND playlistID = ? AND userID = ?";

      sql = mysql.format(sql, [
        req.body.orderID,
        req.body.playlistID,
        req.body.userID,
      ]);

      pool.query(sql, (err, rows) => {
        if (err) {
          return res.json({ success: "error-updating" });
        }
        return res.json({ success: "song-deleted" });
      });
    });
  } else {
    return res.json({ success: "invalid-auth" });
  }
};

const getAllPlaylists = (req, res) => {
  let sql = "select * from playlists where userID = ?";

  sql = mysql.format(sql, req.params.userID);

  pool.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return handleSQLError(res, err);
    }
    console.log(rows);
    return res.json(rows);
  });
};

const getPlaylistsSongs = (req, res) => {
  let sql =
    "SELECT * FROM playlist_songs INNER JOIN songs ON playlist_songs.song_id = songs.song_id WHERE playlist_songs.playlistID = ?";

  sql = mysql.format(sql, req.params.playlistID);

  pool.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return handleSQLError(res, err);
    }
    console.log(rows);
    return res.json(rows);
  });
};

const createPlaylist = (req, res) => {
  if (req.user.user === req.body.userID) {
    console.log("granted access");

    let sql = "INSERT INTO playlists (userID, title) VALUES (?, ?)";

    sql = mysql.format(sql, [req.body.userID, req.body.title]);

    pool.query(sql, (err, rows) => {
      if (err) return handleSQLError(res, err);

      return res.json({
        success: "playlist-created",
        title: req.body.title,
        playlistID: rows.insertId,
        userID: req.body.userID,
      });
    });
  } else {
    return res.json({ success: "invalid-auth" });
  }
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistsSongs,
  getPlaylist,
  addSong,
  deleteSong,
  deletePlaylist,
  renamePlaylist,
};
