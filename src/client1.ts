import net from 'net';

/**
 * Comprobamos si se han pasado argumentos desde la línea de comandos.
 * Si no se han pasado argumentos, mostramos un mensaje de uso y salimos.
 */
if (process.argv.length < 3) {
  console.error('Uso: node client1.js <comando> [argumentos]');
  process.exit(1);
}

/**
 * Recogemos el comando y los argumentos pasados desde la línea de comandos.
 */
const command = process.argv.slice(2).join(' ');

/**
 * Creamos un cliente TCP que se conecta al servidor en el puerto 60300.
 */
const client = net.connect({ port: 60300 }, () => {
  console.log('Conectado al servidor.');
  console.log(`Enviando comando: ${command}`);
  client.write(command);
});

/**
 * Acumulamos los datos recibidos en fragmentos.
 */
let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

/**
 * Cuando se cierra la conexión, mostramos todos los datos acumulados.
 */
client.on('end', () => {
  console.log(`Respuesta completa del servidor:\n${wholeData}`);
  console.log('Conexión cerrada.');
});

/**
 * Manejo de errores
 */
client.on('error', (err) => {
  console.error(`Error en el cliente: ${err.message}`);
});