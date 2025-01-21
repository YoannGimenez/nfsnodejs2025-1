const fs = require("fs");
const path = require("path");


exports.writeLog = (fichier, message) => {
    if (!fs.existsSync(fichier)) {
        fs.writeFileSync(fichier, '', "utf-8");
        console.log("New log file created")
    }
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(fichier, logMessage, (err) => {
        if (err) {
            console.error('error', err);
        }
    });
}

exports.requestLog = (fichier, req) => {
    if (!fs.existsSync(fichier)) {
        fs.writeFileSync(fichier, '', "utf-8");
        console.log("New log file created")
    }
    const logMessage = `${new Date().toISOString()} - ${req.method} - ${req.url}\n`;
    fs.appendFile(fichier, logMessage, (err) => {
        if (err) {
            console.error('error', err);
        }
    });
}

exports.rotateLog = () => {
    const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MO

    const stats = fs.statSync('request.log');

    if (stats.size > MAX_LOG_SIZE) {
        const unique = `request_${Date.now()}.log`;

        fs.renameSync('request.log', path.join(__dirname, unique));

        fs.writeFileSync('request.log', '', 'utf-8');
    }
}