import net from 'net';
import { exec } from 'child_process';

const server = net.createServer((socket) => {
  console.log('Cliente conectado.');

  let buffer = ''; // Buffer para manejar datos fragmentados

  socket.on('data', (data) => {
    buffer += data.toString(); // Acumula los datos recibidos

    let delimiterIndex;
    while ((delimiterIndex = buffer.indexOf('\n')) !== -1) {
      const message = buffer.slice(0, delimiterIndex);
      buffer = buffer.slice(delimiterIndex + 1);

      try {
        const request = JSON.parse(message);
        console.log(`Comando recibido: ${request.command}`);

        exec(request.command, (error, stdout, stderr) => {
          const response = error
            ? { success: false, error: stderr }
            : { success: true, output: stdout };

          socket.write(JSON.stringify(response) + '\n');
        });
      } catch (err) {
        socket.write(JSON.stringify({ success: false, error: 'Formato JSON inválido' }) + '\n');
      }
    }
  });

  socket.on('end', () => {
    console.log('Cliente desconectado.');
  });
});

server.listen(60300, () => {
  console.log('Servidor escuchando en el puerto 60300.');
});