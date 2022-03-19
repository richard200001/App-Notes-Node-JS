const mongoose = require('mongoose');

//process.env.MONGODB_URI//así puedo importar variables de entorno, las variables de entorno me ayudan a que
//el código sea seguro, que no puedan entrar a mi cuenta a través de el link de la base de datos

mongoose.connect(process.env.MONGODB_URI,{//en el primer parámetro colocamos 
 //'mongodb://localhost/aquíelnombredelabasededatos, pero eso ya se coloca en las variables de entorno

   useNewUrlParser: true,//este segundo parámetro es para que no nos de problemas la conexión
  
}) 
 .then(db => console.log('DB is connected'))//si conectó correctamente va a mandar por consola 'DB is connected'
 .catch(err => console.error(err));//si hubo error al conectar mandará el error por la consola 