import net from 'net';
import { RequestType, ResponseType } from '../models/types.js';
import chalk from 'chalk';

export function sendRequest(request: RequestType): Promise<ResponseType> {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const delimiter = '\n';
    let buffer = '';
    let responseTimeout: NodeJS.Timeout;

    // Configurar timeout de conexión (5 segundos)
    const connectionTimeout = setTimeout(() => {
      client.destroy();
      reject(new Error(chalk.red('Connection timeout: No se pudo conectar al servidor')));
    }, 5000);

    client.connect(3000, 'localhost', () => {
      clearTimeout(connectionTimeout);
      console.log(chalk.green('✓ Conexión establecida con el servidor'));

      // Enviar solicitud con delimitador
      const requestData = JSON.stringify(request) + delimiter;
      console.log(chalk.yellow('→ Solicitud enviada:'), requestData.trim());
      client.write(requestData);

      // Configurar timeout de respuesta (10 segundos)
      responseTimeout = setTimeout(() => {
        client.destroy();
        reject(new Error(chalk.red('Timeout: El servidor no respondió a tiempo')));
      }, 10000);
    });

    // Manejar datos recibidos
    client.on('data', (data) => {
      buffer += data.toString();
      
      // Buscar delimitador en el buffer
      const boundary = buffer.indexOf(delimiter);
      if (boundary !== -1) {
        clearTimeout(responseTimeout);
        
        const rawResponse = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + delimiter.length);
        
        try {
          const response: ResponseType = JSON.parse(rawResponse);
          console.log(chalk.blue('← Respuesta recibida:'), rawResponse);

          // Formatear salida para el usuario
          if (response.success) {
            console.log(chalk.green.bold('\n✓ Éxito:'), response.message);
            if (response.funkoPops) {
              console.log(chalk.cyan('\nColección de Funkos:'));
              response.funkoPops.forEach((funko, index) => {
                console.log(chalk.cyan(`\n─── Funko #${index + 1} ───`));
                console.log(`ID: ${chalk.bold(funko.id)}`);
                console.log(`Nombre: ${funko.name}`);
                console.log(`Tipo: ${funko.type}`);
                console.log(`Género: ${funko.genre}`);
                console.log(`Valor de mercado: ${chalk.green(`$${funko.marketValue}`)}`);
                console.log(`Exclusivo: ${funko.exclusive ? chalk.red('Sí') : 'No'}`);
              });
            }
          } else {
            console.log(chalk.red.bold('\n✗ Error:'), response.message);
          }

          client.end();
          resolve(response);
        } catch (parseError) {
          client.destroy();
          reject(new Error(chalk.red(`Error al analizar la respuesta: ${parseError}`)));
        }
      }
    });

    // Manejar errores
    client.on('error', (err) => {
      clearTimeout(connectionTimeout);
      clearTimeout(responseTimeout);
      console.log(chalk.red('✗ Error de conexión:'), err.message);
      client.destroy();
      reject(err);
    });

    // Manejar cierre de conexión
    client.on('close', () => {
      clearTimeout(connectionTimeout);
      clearTimeout(responseTimeout);
      console.log(chalk.yellow('\nConexión cerrada'));
    });
  });
}

// Función para probar la conexión al servidor
export async function testServerConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    const testClient = new net.Socket();
    
    testClient.connect(3000, 'localhost', () => {
      testClient.end();
      console.log(chalk.green('✓ Servidor disponible'));
      resolve(true);
    });

    testClient.on('error', () => {
      console.log(chalk.red('✗ No se pudo conectar al servidor'));
      resolve(false);
    });

    setTimeout(() => {
      testClient.destroy();
      resolve(false);
    }, 2000);
  });
}