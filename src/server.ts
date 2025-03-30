import net from 'net';
import fs from 'fs';
import path from 'path';
import { FunkoPop } from './funko.js';
import { RequestType, ResponseType } from './types.js';
import { MessageEventEmitterServer } from './eventEmitterClient.js';

const server = new MessageEventEmitterServer(60300);

server.on('request', (request: RequestType, connection: net.Socket) => {
  console.log('Petición recibida:', request);

  const userDir = path.join(process.cwd(), 'collections', request.user);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  let response: ResponseType;
  try {
    switch (request.type) {
      case 'add':
        response = handleAdd(request, userDir);
        break;
      case 'update':
        response = handleUpdate(request, userDir);
        break;
      case 'remove':
        response = handleRemove(request, userDir);
        break;
      case 'read':
        response = handleRead(request, userDir);
        break;
      case 'list':
        response = handleList(request, userDir);
        break;
      default:
        response = { 
          type: 'error', 
          success: false, 
          message: 'Operación no válida' 
        };
    }
  } catch (error) {
    response = {
      type: 'error',
      success: false,
      message: `Error procesando la petición: ${error}`
    };
  }

  server.sendResponse(connection, response);
});

server.on('error', (err) => {
  console.error('Error del servidor:', err);
});

function handleAdd(request: RequestType, userDir: string): ResponseType {
  if (!request.funkoPop) {
    return { type: 'add', success: false, message: 'Datos de Funko no proporcionados' };
  }
  
  const filePath = path.join(userDir, `${request.funkoPop.id}.json`);
  if (fs.existsSync(filePath)) {
    return { type: 'add', success: false, message: 'Funko ya existe en la colección' };
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(request.funkoPop, null, 2));
    return { type: 'add', success: true, message: 'Funko añadido correctamente' };
  } catch (error) {
    return { type: 'add', success: false, message: 'Error al guardar el Funko' };
  }
}

function handleUpdate(request: RequestType, userDir: string): ResponseType {
  if (!request.funkoPop) {
    return { type: 'update', success: false, message: 'Datos de Funko no proporcionados' };
  }
  
  const filePath = path.join(userDir, `${request.funkoPop.id}.json`);
  if (!fs.existsSync(filePath)) {
    return { type: 'update', success: false, message: 'Funko no encontrado en la colección' };
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(request.funkoPop, null, 2));
    return { type: 'update', success: true, message: 'Funko actualizado correctamente' };
  } catch (error) {
    return { type: 'update', success: false, message: 'Error al actualizar el Funko' };
  }
}

function handleRemove(request: RequestType, userDir: string): ResponseType {
  if (!request.id) {
    return { type: 'remove', success: false, message: 'ID no proporcionado' };
  }
  
  const filePath = path.join(userDir, `${request.id}.json`);
  if (!fs.existsSync(filePath)) {
    return { type: 'remove', success: false, message: 'Funko no encontrado en la colección' };
  }

  try {
    fs.unlinkSync(filePath);
    return { type: 'remove', success: true, message: 'Funko eliminado correctamente' };
  } catch (error) {
    return { type: 'remove', success: false, message: 'Error al eliminar el Funko' };
  }
}

function handleRead(request: RequestType, userDir: string): ResponseType {
  if (!request.id) {
    return { type: 'read', success: false, message: 'ID no proporcionado' };
  }
  
  const filePath = path.join(userDir, `${request.id}.json`);
  if (!fs.existsSync(filePath)) {
    return { type: 'read', success: false, message: 'Funko no encontrado en la colección' };
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const funko = JSON.parse(data) as FunkoPop;
    return { type: 'read', success: true, funkoPops: [funko] };
  } catch (error) {
    return { type: 'read', success: false, message: 'Error al leer el Funko' };
  }
}

function handleList(request: RequestType, userDir: string): ResponseType {
  if (!fs.existsSync(userDir)) {
    return { 
      type: 'list', 
      success: true, 
      funkoPops: [],
      message: 'El usuario no tiene una colección aún'
    };
  }

  try {
    const files = fs.readdirSync(userDir);
    const funkos: FunkoPop[] = files.map(file => {
      const data = fs.readFileSync(path.join(userDir, file), 'utf-8');
      return JSON.parse(data) as FunkoPop;
    });

    return { type: 'list', success: true, funkoPops: funkos };
  } catch (error) {
    return { 
      type: 'list', 
      success: false, 
      message: 'Error al leer la colección' 
    };
  }
}

console.log('Servidor inicializado y esperando conexiones en el puerto 60300');

server.on('error', (err) => {
  if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
    console.error('Error: El puerto 60300 ya está en uso');
    console.log('Intenta matar el proceso con:');
    console.log('   kill -9 $(lsof -t -i:60300)');
    process.exit(1);
  } else {
    console.error('Error del servidor:', err);
  }
});

process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  server.close();
  process.exit(0);
});