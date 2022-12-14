const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars'); //motor de plantillas
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


//initialization
const app= express();
require('./database');
require('./config/passport');

//SETTIGNS
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); //join es un metodo que permite unir directorios

const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  });
  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");


//MIDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'dinarolina',
    resave: true,
    saveUninitialized: true
}));//esto permite almacenar datos de usuario y generar sesiones temporalmente
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//GLOBAL VARIABLES
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));



//SERVER IS LISTENING
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

