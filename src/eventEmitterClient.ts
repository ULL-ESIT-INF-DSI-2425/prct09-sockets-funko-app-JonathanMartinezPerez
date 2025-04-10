import net from 'net';
import { EventEmitter } from 'events';
import { RequestType, ResponseType } from './types.js';

/**
 * Clase que representa un cliente de socket TCP
 */
export class MessageEventEmitterClient extends EventEmitter {
  /**
   * Cliente TCP
   */
  private client: net.Socket;
  /**
   * Constructor de la clase MessageEventEmitterClient
   * @param connectionOptions Opciones de conexión para el cliente
   */
  constructor(connectionOptions: net.NetConnectOpts) {
    super();
    this.client = net.connect(connectionOptions);

    let wholeData = '';
    this.client.on('data', (dataChunk) => {
      wholeData += dataChunk.toString();
      
      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        try {
          const parsed: ResponseType = JSON.parse(message);
          this.emit('response', parsed);
        } catch (err) {
          this.emit('error', new Error(`Error parsing message: ${err}`));
        }
        messageLimit = wholeData.indexOf('\n');
      }
    });
    
    this.client.on('error', (err) => {
      this.emit('error', err);
    });

    this.client.on('close', () => {
      this.emit('close');
    });
  }

  sendRequest(request: RequestType): void {
    this.client.write(JSON.stringify(request) + '\n');
  }

  close(): void {
    this.client.end();
  }
}

/**
 * Clase que representa un servidor de socket TCP
 */
export class MessageEventEmitterServer extends EventEmitter {
  /**
   * Servidor TCP
   */
  private server: net.Server;
  /**
   * Constructor de la clase MessageEventEmitterServer
   * @param port Puerto en el que el servidor escuchará las conexiones
   */
  constructor(port: number) {
    super();
    this.server = net.createServer({ allowHalfOpen: true }, (connection) => {
      console.log('Cliente conectado');

      let wholeData = '';
      connection.on('data', (dataChunk) => {
        wholeData += dataChunk.toString();

        let messageLimit = wholeData.indexOf('\n');
        while (messageLimit !== -1) {
          const message = wholeData.substring(0, messageLimit);
          wholeData = wholeData.substring(messageLimit + 1);
          try {
            const parsed: RequestType = JSON.parse(message);
            this.emit('request', parsed, connection);
          } catch (err) {
            this.emit('error', new Error(`Error parsing request: ${err}`));
          }
          messageLimit = wholeData.indexOf('\n');
        }
      });

      connection.on('error', (err) => {
        this.emit('error', err);
      });

      connection.on('close', () => {
        console.log('Cliente desconectado');
      });
    });

    this.server.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });

    this.server.on('error', (err) => {
      this.emit('error', err);
    });
  }

  sendResponse(connection: net.Socket, response: ResponseType): void {
    connection.write(JSON.stringify(response) + '\n');
  }

  close(): void {
    this.server.close();
  }
}