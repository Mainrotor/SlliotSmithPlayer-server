const mysql = require("mysql");
const pool = require("../../sql/connection");
const { handleSQLError } = require("../../sql/error");

const getAllSongs = (req, res) => {
  pool.query("SELECT * FROM songs", (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
};

const getSong = (req, res) => {
  let string = "%" + req.params.string + "%";

  let sql = "SELECT * FROM songs WHERE song_name LIKE ?";

  sql = mysql.format(sql, string);

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
};

const songTest = (req, res) => {
  return res.json("song test");
};

module.exports = { getAllSongs, getSong, songTest };
