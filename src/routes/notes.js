const express = require('express');
const router = express.Router();
const Note = require('../models/Note');//Con esta constante Note podemos comunicarnos con la base de datos y decirle que parte del crud queremos hacer
//A parte de ayudarnos a comunicarnos con la base de datos, también nos sirve como clase, para poder crear instancias de ella
const { isAuthenticated } = require('../helpers/auth');//Aquí llamo a la clase que verifica si está o no autenticada la persona

router.get('/notes/add', isAuthenticated, (req,res) => {//Le coloco el nombre de la función antes de cada ruta que quiero proteger
    res.render('notes/new-notes');
});

router.post('/notes/new-note', isAuthenticated, async (req,res) => {
    const {title, description} = req.body;
    const errors = [];
    if(!title){//Si no se escribió un título
        errors.push({text: 'Por favor, ingrese un título'});//agrego al arreglo errors ese error
    }
    if(!description){//Si no se escribió una descripción
        errors.push({text: 'Por favor, ingrese una descripción'});//agrego al arreglo errors ese error
    }
    if(errors.length>0){//Si el arreglo es mayor a 0 siginifica que tiene un error, si es igual a cero no tiene errores
        res.render('notes/new-notes', {errors,title,description});//se envían los los tres en llaves porque los tres son necesarios para que funcione el #each
    }else{
        const newNote = new Note({title,description});
        newNote.user = req.user.id;//Esto es para que solo se muestren las notas del usuario logueado y de nadie mas, le asigno el valor del id del usuario al string
        await newNote.save();//aquí guardo el dato en la base de datos
        req.flash('success_msg', 'Note Added Successfull');//aquí utilizo la variable global flas, primer parámetro es
        //el nombre de la variable y el segundo parámetro es el valor de la variable, es decir el mensaje que quiero mostrarle al usuario
        console.log(newNote);
        res.redirect('/notes');
    }
})

router.get('/notes', isAuthenticated, async(req,res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}).lean();//Aquí estoy buscando los datos guardados en la base de datos
    //con el sort ordenamos las notas de forma que nos salga primero la ultima nota creada
    //En la busqueda tambien le digo que sólo me traiga las notas del usuario logueado y de nadie más
    res.render('notes/all-notes', {notes});//aquí le digo que luego de buscar se direccione a la vista all-notes y en el 
    //segundo parámetro le pasamos los datos para poder usarlo en la vista que la pasé en el primer parámetro
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => {
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title,description});
    req.flash('success_msg','Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg','Note Deleted Successfully');
    res.redirect('/notes');
})

module.exports = router;