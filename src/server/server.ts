// server.ts (corregido)
import net from 'net';
import { RequestType, ResponseType } from '../models/types.js';
import { handleAdd } from './handlers/addHandler.js';
import { handleUpdate } from './handlers/updateHandler.js';
import { handleRemove } from './handlers/removeHandler.js';
import { handleFind } from './handlers/findHandler.js';
import { handleList } from './handlers/listHandler.js';
import { FunkoGenre, FunkoType } from '../models/funko.js';

const server = net.createServer((socket) => {
  let buffer = '';
  const delimiter = '\n';

  socket.on('data', (chunk) => {
    buffer += chunk.toString();
    
    // Procesar todos los mensajes completos en el buffer
    let boundary = buffer.indexOf(delimiter);
    while (boundary !== -1) {
      const message = buffer.substring(0, boundary);
      buffer = buffer.substring(boundary + delimiter.length);
      boundary = buffer.indexOf(delimiter);

      try {
        const request: RequestType = JSON.parse(message);
        console.log('Received request:', request);

        let response: ResponseType;

        switch (request.type) {
          
          case 'add':
            if (request.funkoPop &&
                Object.values(FunkoType).includes(request.funkoPop.type) &&
                Object.values(FunkoGenre).includes(request.funkoPop.genre)) {
              response = handleAdd(request);
            } else {
              response = { 
                success: false, 
                message: 'Invalid Funko data: type or genre not valid' 
              };
            }
            break;

          case 'update':
            if (request.funkoPop &&
                Object.values(FunkoType).includes(request.funkoPop.type) &&
                Object.values(FunkoGenre).includes(request.funkoPop.genre)) {
              response = handleUpdate(request);
            } else {
              response = {
                success: false,
                message: 'Invalid Funko data: type or genre not valid'
              };
            }
            break;

          case 'remove':
            if (request.funkoPop && request.funkoPop.id) {
              response = handleRemove(request);
            } else {
              response = {
                success: false,
                message: 'Invalid Funko ID'
              };
            }
            break;

          case 'find':
            if (request.funkoPop && request.funkoPop.id) {
              response = handleFind(request);
            } else {
              response = {
                success: false,
                message: 'Invalid Funko ID'
              };
            }
            break;

          case 'list':
            if (request.user) {
              response = handleList(request);
            } else {
              response = {
                success: false,
                message: 'User not specified'
              };
            }
            break;

          default:
            response = { 
              success: false, 
              message: 'Invalid request type' 
            };
        }

        // Enviar respuesta con delimitador
        socket.write(JSON.stringify(response) + delimiter, (err) => {
          if (err) console.error('Write error:', err);
        });

      } catch (error) {
        console.error('Error processing request:', error);
        socket.write(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }) + delimiter);
      }
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});