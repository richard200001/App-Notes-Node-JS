const express = require('express');
const router = express.Router();
const User = require('../models/User')
const passport = require('passport');

router.get('/users/signin', (req,res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{//le mandamos el parámetro local, porque esa es la configuraión que hicimos
    successRedirect:'/notes',//si se autenticó bien, entonces lo redirecciona a las notas que tiene en su cuenta
    failureRedirect:'/users/signin',//si se autenticó mal lo redirecciona al signin para que vuelva a intentar autenticarse
    failureFlash: true //esto es para mandar los mensajes flash
}))

router.get('/users/signup', (req,res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req,res) => {
    const {name,email,password,confirm_password} = req.body;
    const errors= [];
    console.log(req.body);
    if(name.length <=0){
        errors.push({text:'Please Insert your name'});
    }
    if(password != confirm_password){
        errors.push({text:'Password do not match'});
    }
    if(password.length < 4){
        errors.push({text:'Password must be at least 4 characters'});
    }
    if(errors.length>0){
        res.render('users/signup', {errors,name,email,password,confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});//aquí hago una busqueda y pregunto que si el correo 
        //que me mandaron por la vista , existe o no en mi base de datos
        console.log(emailUser);
        if(emailUser){//aquí pregunto, si la constante emailUser tiene valor
            console.log('PASÓ POR EL CONDICIONAL');
            req.flash('error_msg', 'The Email is already in use');//si la variabel tiene valor entonces significa que el correo ya está en uso
            res.redirect('/users/signup');//lo redirecciono a la vista de register
        }else{
            const newUser = new User({name,email,password});//instancio o creo un nuevo usuario y lo guardo en la variable newUser
            //para crear ese nuevo usuario estoy utilizando el modelo User
            newUser.password = await newUser.encryptPassword(password);//aquí cifro la contraseña con el metodo de encriptado que cree en el modelo User
            //tener en cuenta que estoy accediendo a la contrasela y le doy el valor cifrado en vez del normal 
            await newUser.save();//aquí guardo al nuevo usuario en la base de datos
            req.flash('success_msg','You are registered');
            res.redirect('/users/signin')
        }    
    }
});

router.get('/users/logout', (req,res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;