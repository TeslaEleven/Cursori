const nodemailer = require("nodemailer");
const ms = require("ms");
const schedule = require("node-schedule");
const req = require("request-promise");
const ejs = require("ejs");
const fs = require("fs");
let Parser = require('rss-parser');
let parser = new Parser();
var config = "";
const SimplDB = require('simpl.db');
const db = new SimplDB();
var luxon = require("luxon");
var date = luxon.DateTime;

class CursoriMailer {
  constructor(config) {
    exports.config = config;
    this.config = config;
    var funcs = config.functions;
    funcs.forEach(function (item, index, array) {
      var rawTimes = config.times[index];
      var times = rawTimes.split(":");
      const rule = new schedule.RecurrenceRule();
      rule.hour = times[0];
      rule.minute = times[1];
      schedule.scheduleJob(rule, funcs[index]);
    });
  }
  send(config) {
    var sysConf = exports.config;
    var transporter = nodemailer.createTransport(sysConf.email);
    console.log(config.to)
    const options = {
      from: `"${config.name}" <${config.from}>`,
      to: config.to,
      subject: config.subject,
      html:
        `<div bgcolor="#ecece7" style="background:#ecece7;margin:0;text-align:center;font-family:Helvetica;padding:7px"><a style="text-decoration:none;color:#B73A68;font-size:25px;font-weight:350" href="https://teslaeleven.github.io/Cursori/">Made with Cursori</a></div>` +
        config.html,
    };
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent message.");
      }
    });
  }
}

class CursoriDB {
  async add(key, value) {
    var escaped = key.replace(/\./g, "_");
    var val = await db.set(escaped, value)
    return val
  }

  async rem(key) {
    var escaped = key.replace(/\./g, "_");
    var val = await db.delete(escaped)
    return val
  }

  async get(key) {
    var escaped = key.replace(/\./g, "_");
    var val = await db.get(escaped)
    return val;
  }

  async list() {
    var list = await db.toJSON()
    return list;
  }
}

class CursoriUtils {
  async fetch(url) {
    var res = rp(url)
      .then(function (res) {
        return res;
      })
      .catch(function (err) {
        console.error(err);
        return;
      });
    return res;
  }

  greet() {
    const greetings = [
      "Hi there!",
      "Hey, how's it going?",
      "How are you doing?",
      "Wassup?",
      "What's cracking?",
      "Greetings, Earthling!",
      "Howdy-do!",
      "Salutations, my friend.",
      "Hiya!",
      "Nice to meet you.",
      "Hey, what's happening?",
      "What's happening, captain?",
      "How's life treating you?",
      "Top of the morning to you!",
      "Ahoy, matey!",
      "Hi-de-ho!",
      "What's the good word?",
      "Good to see you!",
      "How goes it?",
      "Hey, partner!",
      "Howdy, y'all!",
      "Well, hello there!",
      "Hey, howdy, hey!",
      "What's the buzz?",
      "Long time no see!",
      "G'day, mate!",
      "Hi, ho, Silver!",
      "Aloha, amigos!",
      "How's everything?",
      "Greetings from Hollywood!",
      "Pleasure to make your acquaintance.",
      "What's the scoop?",
      "Welcome, welcome, welcome!",
      "Live long and prosper",
      "Greetings and salutations",
      "Hello there",
      "What's up, doc?",
      "Cowabunga!",
      "Make it so",
      "Everything is awesome!",
      "Namaste",
      "Aloha",
      "Yo",
      "Hakuna Matata",
      "Bazinga!",
      "You shall not pass!",
      "Howdy",
      "Good day",
      "G'day mate",
      "Bonjour",
      "Hola",
      "Hello World!",
      "Sup",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  time(val) {
    return ms(val);
  }

  renderPage(file, data = {}, ops = {}) {
    const contents = fs.readFileSync(file, "utf8");
    var rendered = ejs.render(contents, data, ops);
    return rendered;
  }

  async parseRss(url) {
    let rss = await parser.parseURL(url);
    return rss;
  }

  timestamp(tz) {
    var now = date.now();
    var format = { year: "numeric", month: "long", day: "numeric" };
    return now.setLocale(tz).toLocaleString(format);
  }
}

module.exports = {
  CursoriMailer,
  CursoriDB,
  CursoriUtils,
};
