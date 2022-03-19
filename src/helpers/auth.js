const helpers = {}

helpers.isAuthenticated = (req, res, next) => {//Este es un middlewares, que verifica si está o no autenticad la persona
    if (req.isAuthenticated()) {
      return next();//Si está autenticada la persona, entonces lo deja seguir normal
    }
    req.flash("error_msg", "Not Authorized.");//De lo contrario mana un mensaje de error con flash
    res.redirect("/users/signin");//Y lo redirecciona a autenticarse signin
  };

module.exports=helpers;