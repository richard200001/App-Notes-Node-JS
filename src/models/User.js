const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
//tener en cuenta que aquí no se guarda la imagen como tal, solamente se guardan los datos de la imagen
//aquí creamos el esquema de la base de datos
const UserSchema = new Schema({
    name: {type: String, required: true},//required: true, es para decirle que ese dato no esté vacío
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async(password) => {//Aquí estoy creando un método para encriptar las contraseñas
    //llamo al esquema, llamo crear methods y coloco el nombre del método que quiero, que en este caso lo voy a llamar encryptPassword
    const salt = await bcrypt.genSalt(10);//le digo que aplique el algoritmo de cifrado 10 veces, es una forma normal de hacerlo para que no gaste muchos recurso
    const hash = bcrypt.hash(password, salt);//aquí cifro la contraseña
    return hash;//retorno la variable hash que es la que contiene la contraseña cifrada
}

UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);//aquí retorno la comparación de la contraseña que se insertó en la vista
    //es decir, la contraseña que me dan, y la comparo con la contraseña del modelo de datos, esto dará de resultado
    //un booleano, true o  false, es decir compara si la contraseña que tengo guardada en mi base de datos es la misma que 
    //mandé por la vista
}

//aquí empezamos a utilizar el esquema de la base de datos
module.exports = model('User', UserSchema);//el primer parámetro es el nombre del esquema, el segundo
//es la constante del esquema de la base de datos