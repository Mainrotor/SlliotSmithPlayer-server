const mysql = require("mysql");
const pool = require("../../sql/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { handleSQLError } = require("../../sql/error");

const checkEmail = (req, res) => {
  let sql = "SELECT COUNT(email) FROM users WHERE email = ?";
  sql = mysql.format(sql, req.params.string);

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    let emailCount = rows[0]["COUNT(email)"];
    return res.json(emailCount);
  });
};

const authenticateToken = (req, res, next) => {
  console.log("authorizing");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("Your token is null");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Your token is invalid");
    console.log("successfully validated");
    req.user = user;
    next();
  });
};

const createAccount = async (req, res) => {
  try {
    let sql = "SELECT COUNT(email) FROM users WHERE email = ?";
    let emailAddrs = req.body.email;
    sql = mysql.format(sql, emailAddrs);

    const hashedPassword = await bcrypt.hash(req.body.pass, 10);

    pool.query(sql, (err, rows) => {
      if (err)
        return handleSQLError(res, err + " error counting email " + req.body);
      let emailCount = rows[0]["COUNT(email)"];
      console.log(emailCount + " email count");
      if (emailCount == 0) {
        sql = `INSERT INTO users (username, pass, email) VALUES (?, ?, ?)`;

        sql = mysql.format(sql, [
          req.body.username,
          hashedPassword,
          req.body.email,
        ]);

        pool.query(sql, (err, rows) => {
          if (err)
            return handleSQLError(res, err + " error posting " + req.body);
          return res.json({ success: "account-created" });
        });
      } else if (emailCount > 0) {
        return res.json({ success: "email-in-use" });
      }
    });
  } catch {
    res.json({ success: "unknown-error" });
  }
};

const login = async (req, res) => {
  let sql = "SELECT email, pass, userID FROM users WHERE email = ?";

  sql = mysql.format(sql, req.body.email);

  pool.query(sql, async (err, rows) => {
    if (err) return handleSQLError(res, err + " error finding email ");
    let userData = rows[0];
    console.log(rows);

    try {
      await bcrypt.compare(
        req.body.pass,
        userData.pass,
        function (err, result) {
          if (err) {
            throw err;
          }
          if (result === true) {
            //authenticate with jws
            const user = { user: userData.userID };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            console.log(accessToken + " " + userData.userID);
            return res.json({
              success: "login-success",
              accessToken: accessToken,
              userID: userData.userID,
            });
          } else return res.json({ success: "login-failed" });
        }
      );
    } catch {
      return res.json({ success: "email-not-found" });
    }
  });
};

module.exports = {
  checkEmail,
  createAccount,
  login,
  authenticateToken,
};
