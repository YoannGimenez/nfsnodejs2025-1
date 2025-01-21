const Presentation = require("../model/Presentation");

exports.findAll = async (req,res) => {
    let presentation = await Presentation.find();
    res.json(presentation);
}

exports.postPresentation = async (req,res) => {
    let presentation = new Presentation(req.body);
    await presentation.save();
    res.json(presentation);
}

exports.putPresentation = async (req,res) => {
    let presentation = await Presentation.findById(req.params.id);
    presentation.set(req.body);
    await presentation.save();
    res.json(presentation);
}