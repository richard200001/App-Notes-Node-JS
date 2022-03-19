const {Schema, model} = require('mongoose');
//tener en cuenta que aquí no se guarda la imagen como tal, solamente se guardan los datos de la imagen
//aquí creamos el esquema de la base de datos
const NoteSchema = new Schema({
    title: {type: String, required: true},//required: true, es para decirle que ese dato no esté vacío
    description: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String}
});
//aquí empezamos a utilizar el esquema de la base de datos
module.exports = model('Note', NoteSchema);//el primer parámetro es el nombre del esquema, el segundo
//es la constante del esquema de la base de datos