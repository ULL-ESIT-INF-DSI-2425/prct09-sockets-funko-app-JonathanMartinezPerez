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
 * Cuando el cliente recibe datos del servidor, los muestra en la consola
 * y cierra la conexión.
 */
client.on('data', (data) => {
  console.log(`Respuesta del servidor:\n${data.toString()}`);
  client.end();
});

/**
 * Manejo de errores
*/
client.on('error', (err) => {
  console.error(`Error en el cliente: ${err.message}`);
});

/**
 * Mensaje al cerrar conexión
 */
client.on('end', () => {
  console.log('Conexión cerrada.');
});