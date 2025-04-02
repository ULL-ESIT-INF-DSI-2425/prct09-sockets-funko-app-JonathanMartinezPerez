import net from 'net';

const client = net.createConnection({ port: 60300 }, () => {
  console.log('Conectado al servidor.');

  const command = process.argv.slice(2).join(' ');
  if (!command) {
    console.error('Por favor, proporciona un comando para ejecutar.');
    client.end();
    return;
  }

  const request = { command };
  client.write(JSON.stringify(request) + '\n'); // Agregamos el delimitador
});

client.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response.success) {
      console.log(`Resultado:\n${response.output}`);
    } else {
      console.error(`Error: ${response.error}`);
    }
  } catch (err) {
    console.error('Respuesta inválida del servidor:', data.toString());
  }
  client.end();
});

client.on('error', (err) => {
  console.error(`Error de conexión: ${err.message}`);
});

client.on('end', () => {
  console.log('Desconectado del servidor.');
});