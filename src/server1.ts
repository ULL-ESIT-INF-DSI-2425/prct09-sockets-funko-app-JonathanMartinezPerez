import net from 'net';
import { exec } from 'child_process';

/**
 * Creamos el servidor 
 */
const server = net.createServer((socket) => {
  console.log('Cliente conectado.');

  /**
   * Comando recibido + resultado
   */
  socket.on('data', (data) => {
    const command = data.toString().trim();
    console.log(`Comando recibido: ${command}`);
    /**
     * Ejecutamos el comando y mostramos su salida
     */
    exec(command, (error, stdout, stderr) => {
      if (error) {
        socket.write(`Error: ${stderr}`);
      } else {
        // Enviamos el resultado completo como un único mensaje
        socket.write(`\n-----Resultado:-----\n${stdout}`);
      }
      // Cerramos la conexión después de enviar la respuesta
      socket.end();
    });
  });

  /**
   * Cuando termina muestra mensaje de cliente desconectado
   */
  socket.on('end', () => {
    console.log('Cliente desconectado.');
  });
});

/**
 * Servidor escuchando en el puerto 60300
 */
server.listen(60300, () => {
  console.log('Servidor escuchando en el puerto 60300.');
});

/**
 * Función para cerrar el servidor al recibir la señal SIGINT.
 */
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  server.close();
  process.exit(0);
});
