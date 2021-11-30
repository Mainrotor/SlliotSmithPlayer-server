const mysql = require("mysql");
const pool = require("../../sql/connection");
const { handleSQLError } = require("../../sql/error");

const getAlbum = (req, res) => {
  let sql =
    "select albums.albumID, albums.album_title, albums.artist_name, albums.release_year, albums.track_count, albums.length, albums.album_art_path, songs.song_id, songs.song_name, songs.track_num, songs.track_length, songs.path from albums left join songs on albums.albumID = songs.albumID where albums.albumID = ?";

  sql = mysql.format(sql, req.params.albumID);

  pool.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return res.json({ success: "album-not-found" });
    }
    let albumInfo = {
      albumID: rows[0].albumID,
      albumTitle: rows[0].album_title,
      artistName: rows[0].artist_name,
      releaseYear: rows[0].release_year,
      trackCount: rows[0].track_count,
      albumLength: rows[0].length,
      albumArtPath: rows[0].album_art_path,
    };

    let songs = [];

    for (let i = 0; i < rows.length; i++) {
      let row = {
        songID: rows[i].song_id,
        songName: rows[i].song_name,
        trackNum: rows[i].track_num,
        trackLength: rows[i].track_length,
        path: rows[i].path,
      };

      songs.push(row);
    }

    let result = { albumInfo: albumInfo, songs: songs };

    return res.json(result);
  });
};

module.exports = {
  getAlbum,
};
