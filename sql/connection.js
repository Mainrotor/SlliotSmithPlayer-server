const mysql = require("mysql");

class Connection {
  constructor() {
    if (!this.pool) {
      console.log("creating connection...");
      this.pool = mysql.createPool({
        connectionLimit: 100,
        host: "database-2.cqcgbaamdiuw.us-east-2.rds.amazonaws.com",
        user: "admin",
        password: "AB8675309Az!",
        database: "sys",
      });

      return this.pool;
    }

    return this.pool;
  }
}

const instance = new Connection();

module.exports = instance;
