const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;//Acá le digo que solo quiero la estrategia de autenticación
const User = require('../models/User');

passport.use(new LocalStrategy({//en este caso utilizo passport para definir una nueva estrategia de autenticación
      usernameField: "email",//tenemos que pasarle el username de nuestro ususario, en nuestro caso es el email,ese es el primer parámetro
    }, async (email, password, done) => {// el segungo parámetro es una función, tiene tres parámetros, el email que recibe, la contraseña un callback
      // Match Email's User, buscamos el correo del usuario
      const user = await User.findOne({ email: email });// de resultado devuelve un usuario

      if (!user) {//si no existe un usuario en la base de datos 
        return done(null, false, { message: "Not User found." });//el done es un callback, es decir una función, que recibe tres parámetros
        //null significa que no manda errores, false siginifca que no existe ese usuario, y luego le mandamos el mensaje a la vista a traves de message
      } else {
        // Match Password's User,
        const match = await user.matchPassword(password);//return true or false
        if (match) {//pregunta si existe esa contraseña
          return done(null, user);//si existe return el usuario que encontré, hasta aquí todo ha sido válido y ya ha sido autenticado
        } else {
          return done(null, false, { message: "Incorrect Password." });//aquí significa que la contraseña es incorrecta, y le
          //mandamos tres parámetros, el primero es null para el error, el segundo quiere decir que la contraseña no está en la base de datos
          //el tercero es el mensaje que mandamos a la vista
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {//recibimos por parámetro el usuario, y el callback
  done(null, user.id);//aquí estamos almacenando al usuario, es decir sus datos en una sesión
  //una sesión es un función que almacena los datos durante cierto periodo de tiempo
});

passport.deserializeUser((id, done) => {//recibimos por parámetro el id del usuario, y el callback
  User.findById(id, (err, user) => {//buscamos el usuario
    done(err, user);//si no lo encuentra entonces returnará error, de lo contrario returnará el usuario
  });
});