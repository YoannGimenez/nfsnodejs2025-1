const Article = require("../model/Article");
const logFunction = require("../logFunction");

exports.findAll = async (req,res) => {
    logFunction.requestLog("route.log", req);
    let article = await Article.find();
    res.json(article);
}

exports.postArticle = async (req,res) => {
    logFunction.requestLog("route.log", req);
    let article = new Article(req.body);
    await article.save();
    res.json(article);
}