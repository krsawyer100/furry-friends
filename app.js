require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const connection = require("./config/connection");
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");
const app = express();
const methodOverride = require("method-override")

const sessionStore = new MySQLStore({}, connection);
app.use(
  session({
    key: "session_cookie",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.engine("handlebars", exphbs.engine({
  helpers: {
    isEqual: function(a, b) {
      return a === b
    },
    formatTags: function(tags) {
      return tags.join(", ")
    },
    isTrueOrFalse: function(attributes) {
      if (attributes === true) {
        return "Yes"
      } if (attributes === false) {
        return "No"
      }
    }
  }
}));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(methodOverride("_method"))

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

module.exports = app;
