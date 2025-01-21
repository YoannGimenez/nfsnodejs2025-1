// Import
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logFunction = require('./logFunction');
const messageEmitter = require('./event');
require('dotenv').config();
const cors = require('cors');
const compression = require('compression');
const {createLogger, format, transports} = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require("path");
const nodemailer = require("nodemailer");
const helmet = require("helmet");

// Routes Import
const articleRoute = require('./route/article.route');
const presentationRoute = require('./route/presentation.route');
const factureRoute = require('./route/facture.route');
const cryptoRoute = require('./route/crypto.route');
const helmet = require("helmet");

const logFormat = format.combine(
    format.timestamp({format : 'MM-DD-YYYY HH:mm:ss'}),
    format.printf(({timestamp,level,message}) => `${timestamp} [${level.toUpperCase()}] - ${message}`)
);

const logLevel = {
  levels: {
    info: 0,
    warn :1 ,
    error : 2,
    crit : 3
  }
}

const logger = createLogger({
  levels: logLevel.levels,
  format : logFormat,
  transports : [
    new transports.Console(),
    new DailyRotateFile({
      filename : path.join(__dirname, './logs/app-%DATE%.log'),
      datePattern: 'MM-DD-YYYY',
      maxSize: '5m',
    }),
    new DailyRotateFile({
      filename : path.join(__dirname, './logs/error-%DATE%.log'),
      datePattern: 'MM-DD-YYYY',
      maxSize: '5m',
    })
  ]
})

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure : process.env.EMAIL_SECURE  === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls : {
    rejectUnauthorized: false
  }
})
async function sendMail(errorMessage){
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to : process.env.EMAIL_TO,
      subject : 'ALERTE CRITIQUE',
      text: `Alerte critique : ${errorMessage}`,
      html: `<h2>ALERTE CRITIQUE : ${errorMessage} </h2>`
    };
    await transporter.sendMail(mailOptions);
    console.log('Mail envoyé ');
  }catch (error ){
    console.error('Erreur', error)
  }
}
logger.on('crit', (error) => {
  console.log('Erreur critique detecté ', error.message)
  logger.crit('Erreur critique detecté ' +  error.message)
  sendMail(error.message)
})


app.use(cors({
  origin: 'http://bci25.portfolio-etudiant-rouen.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());


app.use(compression({
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return !req.path.match(/\.(jpg|jpeg|png|gif|pdf|svg|mp4)$/i);
  }
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log Middleware Request
app.use((req, res, next) => {
  logFunction.rotateLog();
  logFunction.requestLog(req, res, next);
  logger.info(` ${req.method} - ${req.url} - IP:  ${req.ip}`);
  messageEmitter.emit('message_call', req.url);
});

// Routes
app.use('/api/article', articleRoute);
app.use('/api/presentation', presentationRoute);
app.use('/api/facture', factureRoute);
app.use('/api/crypto', cryptoRoute);

// Server
app.listen(process.env.PORT, () => {

  // Log File
  logFunction.writeLog('server.log', 'Serveur démarré');
  console.log('Server listening on port ' + process.env.PORT);
});

// Database
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//       console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//       console.error('Error connecting to MongoDB:', error);
//     });