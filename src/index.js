if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();//esto hace que mi programa pueda leer las variables de entorno
}

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

//Initializations
const app = express();
require('./database');
require('./config/passport');//aquí tenemos nuestra autenticación terminada

//Settings
app.set('port', process.env.PORT || 3400);
app.set('views',path.join(__dirname,'views'));
console.log(path.join(__dirname,'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',//Esta va a ser el archivo que se va abrir por defecto o siempre que se busque la carpeta layouts
    layoutsDir: path.join(app.get('views'), 'layouts'),//aquí se da la dirección de la carpeta layouts para que pueda encontrar el archivo main
    partialsDir: path.join(app.get('views'), 'partials'),//los partials son las partes de html que podemos reutilizar, por ejemplo el footer, la navigation
    extname: '.hbs'//esta parte es para decirle que todos nuestros archivos de vista terminan en la extensión hbs
}));//todo este app.engine solo es para configurar o inicializar el motor de plantilla handlebars
app.set('view engine', '.hbs');//con esto ya decimos que vamos a utilizarlo o que estamos utilizandolo
console.log(path.join(app.get('views'), 'partials'));



//Middlewares 
app.use(express.urlencoded({extended:false}));//el método express.urlencoded() sirve para que el programa entienda los distintos tipos de datos que vamos a procesar, le coloco extended:false para que solo acepte datos 
app.use(methodOverride('_method'));//este método es para tener más opciones de métodos a parte del get y post
app.use(session({//este método es para poder guardar los datos del usuario durante cierto tiempo, es decir la autenticación del usuario tiene un tiempo límite
    secret: process.env.SECRET_WORD,//esta
    resave: true,//esta
    saveUninitialized:true//y esat son configuraciones básicas para lo del inicio de sesión

}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');//aquí creamos variables globales
    res.locals.error_msg = req.flash('error_msg');//aquí creamos variables globales
    res.locals.error = req.flash('error');//esta es la variable local para el passport/autenticación, específicamente 
    //tiene que escribirse así
    res.locals.user = req.user || null;
  //  
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'), () => {
    console.log('Server on port',app.get('port') );
    console.log('Environment: ', process.env.NODE_ENV);
})