const express = require('express');
const session = require('express-session')
const LokiStore = require('connect-loki')(session)
const flash = require('connect-flash')
const nunjucks = require('nunjucks');
const path = require('path');
const dateFilter = require('nunjucks-date-filter');

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  middlewares() {
    this.express.use(express.urlencoded({ urlencoded: false }))
    this.express.use(flash())
    this.express.use(session({
      name: 'root',
      secret: 'MyAppSecret',
      resave: true,
      store: new LokiStore({
        path: path.resolve(__dirname, '..', 'tmp', 'session.db')
      }),
      saveUninitialized: true
    }))
  }

  views() {
    const env = nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      watch: this.isDev,
      express: this.express,
      autoescape: true
    })

    env.addFilter('date', dateFilter);

    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk')
  }

  routes() {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
