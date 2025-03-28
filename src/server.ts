import { fileURLToPath } from 'url';
import { dirname } from 'path';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { FunkoPop } from './funko.js';
import { RequestType, ResponseType } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = net.createServer({ allowHalfOpen: true }, (connection) => {
  console.log('Cliente conectado');

  let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;
  });

  connection.on('end', () => {
    try {
      const request: RequestType = JSON.parse(wholeData);
      console.log('Petición recibida:', request);
  
      const userDir = path.join(process.cwd(), 'collections', request.user);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }
  
      let response: ResponseType;
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
            type: request.type, 
            success: false, 
            message: 'Operación no válida' 
          };
      }
      // Enviar respuesta y luego cerrar
      const responseData = JSON.stringify(response) + '\n';
      connection.write(JSON.stringify(responseData), (err) => {
        if (err) console.error('Error enviando respuesta:', err);
        connection.end();
      });
    } catch (error) {
      console.error('Error:', error);
      connection.write(JSON.stringify({
        type: 'error',
        success: false,
        message: 'Error procesando la petición'
      }), () => {
        connection.end();
      });
    }
  });

  connection.on('error', (err) => {
    console.error('Error de conexión:', err);
  });
});

// Implementa las demás funciones handleUpdate, handleRemove, etc. de forma similar

function handleAdd(request: RequestType, userDir: string): ResponseType {
  if (!request.funkoPop) {
    return { type: 'add', success: false, message: 'Datos de Funko no proporcionados' };
  }
  
  const filePath = path.join(userDir, `${request.funkoPop.id}.json`);
  if (fs.existsSync(filePath)) {
    return { type: 'add', success: false, message: 'Funko ya existe en la colección' };
  }

  fs.writeFileSync(filePath, JSON.stringify(request.funkoPop, null, 2));
  return { type: 'add', success: true, message: 'Funko añadido correctamente' };
}


function handleUpdate(request: RequestType, userDir: string): ResponseType {
  if (!request.funkoPop) throw new Error('Datos de Funko no proporcionados');
  
  const filePath = path.join(userDir, `${request.funkoPop.id}.json`);
  if (!fs.existsSync(filePath)) {
    return { type: 'update', success: false, message: 'Funko no encontrado en la colección' };
  }

  fs.writeFileSync(filePath, JSON.stringify(request.funkoPop));
  return { type: 'update', success: true, message: 'Funko actualizado correctamente' };
}

function handleRemove(request: RequestType, userDir: string): ResponseType {
  if (!request.id) throw new Error('ID no proporcionado');
  
  const filePath = path.join(userDir, `${request.id}.json`);
  if (!fs.existsSync(filePath)) {
    return { type: 'remove', success: false, message: 'Funko no encontrado en la colección' };
  }

  fs.unlinkSync(filePath);
  return { type: 'remove', success: true, message: 'Funko eliminado correctamente' };
}

function handleRead(request: RequestType, userDir: string): ResponseType {
  if (!request.id) throw new Error('ID no proporcionado');
  
  const filePath = path.join(userDir, `${request.id}.json`);
  if (!fs.existsSync(filePath)) {
    return { type: 'read', success: false, message: 'Funko no encontrado en la colección' };
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  const funko = JSON.parse(data) as FunkoPop;
  return { type: 'read', success: true, funkoPops: [funko] };
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

  const files = fs.readdirSync(userDir);
  const funkos: FunkoPop[] = files.map(file => {
    const data = fs.readFileSync(path.join(userDir, file), 'utf-8');
    return JSON.parse(data) as FunkoPop;
  });

  return { type: 'list', success: true, funkoPops: funkos };
}

// Manejar errores de conexión
server.listen(60300, () => {
  console.log('Servidor escuchando en el puerto 60300');
});

// Manejar errores de puerto en uso
server.on('error', (err) => {
  if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
    console.error('Error: El puerto 60300 ya está en uso');
    console.log('Intenta matar el proceso con:');
    console.log('   kill -9 $(lsof -t -i:60300)');
    process.exit(1);
  }
});

// Manejar cierre con Ctrl+C
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  server.close(() => process.exit(0));
});