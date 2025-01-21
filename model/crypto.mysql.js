const sql = require('../config/db');

const Crypto = function (crypto) {
    this.name = crypto.name;
    this.prix = crypto.prix;
    this.devise = crypto.devise;
}

Crypto.create = (newCrypto, result) => {
    sql.query("INSERT INTO crypto SET ? ", newCrypto, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created crypto: ", { id: res.insertId, ...newCrypto });
        result(null, { id: res.insertId, ...newCrypto });
    });
};

Crypto.findAll = (result) => {
    sql.query("SELECT * FROM crypto", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("crypto: ", res);
        result(null, res);
    });
};
