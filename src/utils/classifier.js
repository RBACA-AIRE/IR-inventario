import natural from 'natural';

const classifier = new natural.BayesClassifier();

// Saludos
classifier.addDocument('hola', 'saludo');
classifier.addDocument('buenas', 'saludo');
classifier.addDocument('hey', 'saludo');

// Capacidades
classifier.addDocument('que puedes hacer', 'capacidad');
classifier.addDocument('que sabes hacer', 'capacidad');
classifier.addDocument('que eres capaz de hacer', 'capacidad');

// Agradecimientos
classifier.addDocument('gracias', 'agradecimiento');
classifier.addDocument('muchas gracias', 'agradecimiento');
classifier.addDocument('gracias bot', 'agradecimiento');

// Despedidas
classifier.addDocument('adios', 'despedida');
classifier.addDocument('chao', 'despedida');
classifier.addDocument('hasta luego', 'despedida');

// Usuarios registrados
classifier.addDocument('cuantos usuarios registrados hay', 'usuariosRegistrados');
classifier.addDocument('numero de usuarios', 'usuariosRegistrados');
classifier.addDocument('total de usuarios', 'usuariosRegistrados');
classifier.addDocument('cuantos usuarios tengo', 'usuariosRegistrados');

// Buscar por IP
classifier.addDocument('a que servidor pertenece esta ip', 'buscarPorIP');
classifier.addDocument('esta ip a que servidor pertenece', 'buscarPorIP');
classifier.addDocument('ip pertenece a que servidor', 'buscarPorIP');

// Buscar aplicación de negocio por servidor
classifier.addDocument('que aplicacion tiene este servidor', 'buscarAplicacion');
classifier.addDocument('que sistema corre este servidor', 'buscarAplicacion');
classifier.addDocument('servidor asociado a que aplicacion', 'buscarAplicacion');

// Buscar credenciales de administrador
classifier.addDocument('usuario y contraseña de administrador de este servidor', 'buscarCredenciales');
classifier.addDocument('credenciales de administrador de este servidor', 'buscarCredenciales');
classifier.addDocument('cuenta admin de este servidor', 'buscarCredenciales');

// Capacidades del servidor
classifier.addDocument('capacidades de este servidor', 'buscarCapacidades');
classifier.addDocument('que puede hacer este servidor', 'buscarCapacidades');
classifier.addDocument('que hace este servidor', 'buscarCapacidades');

// Accesos Remotos Registrados
classifier.addDocument('cuantos accesos tengo', 'accesosRegistrados');
classifier.addDocument('cantidad de accesos remotos', 'accesosRegistrados');
classifier.addDocument('cuantos accesos remotos hay', 'accesosRegistrados');
classifier.addDocument('numero de accesos registrados', 'accesosRegistrados');
classifier.addDocument('total de accesos remotos', 'accesosRegistrados');


classifier.train();

export default classifier;


// utils/helpers.js
export function extraerIP(texto) {
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
  const match = texto.match(ipRegex);
  return match ? match[0] : null;
}

export function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[^\w\s\.\-@]/g, "");
}
