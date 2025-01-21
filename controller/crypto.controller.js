const Crypto = require("../model/crypto.mysql");

exports.create = (req, res) => {
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const cryptoInsert = new Crypto({
        name: req.body.name,
        prix: req.body.prix,
        devise: req.body.devise
    });

    Crypto.create(cryptoInsert, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Crypto."
            });
        } else {
            res.send(data);
        }
    });
}

exports.findAll = (req, res) => {
    Crypto.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving crypto."
            });
        } else {
            res.send(data);
        }
    });
}