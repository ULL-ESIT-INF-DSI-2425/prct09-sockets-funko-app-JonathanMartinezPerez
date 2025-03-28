import net from 'net';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { FunkoPop, FunkoType, FunkoGenre } from './funko.js';
import { RequestType, ResponseType } from './types.js';

yargs(hideBin(process.argv))
  .command('add', 'Añade un Funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    description: { type: 'string', demandOption: true },
    type: { type: 'string', choices: Object.values(FunkoType), demandOption: true },
    genre: { type: 'string', choices: Object.values(FunkoGenre), demandOption: true },
    franchise: { type: 'string', demandOption: true },
    number: { type: 'number', demandOption: true },
    exclusive: { type: 'boolean', demandOption: true },
    specialFeatures: { type: 'string', demandOption: true },
    marketValue: { type: 'number', demandOption: true }
  }, (argv) => {
    const funko: FunkoPop = {
      id: argv.id,
      name: argv.name,
      description: argv.description,
      type: argv.type as FunkoType,
      genre: argv.genre as FunkoGenre,
      franchise: argv.franchise,
      number: argv.number,
      exclusive: argv.exclusive,
      specialFeatures: argv.specialFeatures,
      marketValue: argv.marketValue
    };
    sendRequest({ type: 'add', user: argv.user, funkoPop: funko });
  })
  .command('update', 'Actualiza un Funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    description: { type: 'string', demandOption: true },
    type: { type: 'string', choices: Object.values(FunkoType), demandOption: true },
    genre: { type: 'string', choices: Object.values(FunkoGenre), demandOption: true },
    franchise: { type: 'string', demandOption: true },
    number: { type: 'number', demandOption: true },
    exclusive: { type: 'boolean', demandOption: true },
    specialFeatures: { type: 'string', demandOption: true },
    marketValue: { type: 'number', demandOption: true }
  }, (argv) => {
    const funko: FunkoPop = {
      id: argv.id,
      name: argv.name,
      description: argv.description,
      type: argv.type as FunkoType,
      genre: argv.genre as FunkoGenre,
      franchise: argv.franchise,
      number: argv.number,
      exclusive: argv.exclusive,
      specialFeatures: argv.specialFeatures,
      marketValue: argv.marketValue
    };
    sendRequest({ type: 'update', user: argv.user, funkoPop: funko });
  })
  .command('remove', 'Elimina un Funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    sendRequest({ type: 'remove', user: argv.user, id: argv.id });
  })
  .command('read', 'Muestra un Funko', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    sendRequest({ type: 'read', user: argv.user, id: argv.id });
  })
  .command('list', 'Lista todos los Funkos de un usuario', {
    user: { type: 'string', demandOption: true }
  }, (argv) => {
    sendRequest({ type: 'list', user: argv.user });
  })
  .argv;

  function sendRequest(request: RequestType) {
    return new Promise<void>((resolve, reject) => {
      const client = net.connect({ port: 60300 }, () => {
        console.log('Enviando petición:', request);
        client.write(JSON.stringify(request) + '\n'); // Añade delimitador
      });
  
      let buffer = '';
      client.on('data', (data) => {
        buffer += data.toString();
        
        // Verificar si hemos recibido un mensaje completo (terminado en \n)
        if (buffer.includes('\n')) {
          const messages = buffer.split('\n');
          buffer = messages.pop() || ''; // Guardar cualquier dato incompleto
          
          messages.forEach(msg => {
            if (msg) {
              try {
                const response: ResponseType = JSON.parse(msg);
                handleResponse(response);
                client.end();
                resolve();
              } catch (err) {
                console.error('Error parsing response:', err);
                reject(err);
              }
            }
          });
        }
      });
  
      client.on('end', () => {
        if (buffer) {
          try {
            const response: ResponseType = JSON.parse(buffer);
            handleResponse(response);
            resolve();
          } catch (err) {
            console.error('Error parsing final data:', err);
            reject(err);
          }
        }
        resolve();
      });
  
      client.on('error', (err) => {
        console.error('Connection error:', err);
        reject(err);
      });
  
      setTimeout(() => {
        if (!buffer) {
          console.error('Timeout: No response from server');
          client.destroy();
          reject(new Error('Timeout'));
        }
      }, 5000);
    });
  }

function handleResponse(response: ResponseType) {
  if (response.success) {
    if (response.type === 'list' && response.funkoPops) {
      console.log(chalk.green(`Colección de Funkos:`));
      response.funkoPops.forEach(funko => {
        console.log(chalk.green(`--------------------------------`));
        printFunkoDetails(funko);
      });
    } else if (response.type === 'read' && response.funkoPops) {
      printFunkoDetails(response.funkoPops[0]);
    } else {
      console.log(chalk.green(response.message));
    }
  } else {
    console.log(chalk.red(response.message));
  }
}

function printFunkoDetails(funko: FunkoPop) {
  console.log(chalk.blue('--------------------------------'));
  console.log(chalk.bold(`ID: ${funko.id}`));
  console.log(chalk.bold(`Nombre: ${funko.name}`));
  console.log(chalk.bold(`Descripción: ${funko.description}`));
  console.log(chalk.bold(`Tipo: ${funko.type}`));
  console.log(chalk.bold(`Género: ${funko.genre}`));
  console.log(chalk.bold(`Franquicia: ${funko.franchise}`));
  console.log(chalk.bold(`Número: ${funko.number}`));
  console.log(chalk.bold(`Exclusivo: ${funko.exclusive ? 'Sí' : 'No'}`));
  console.log(chalk.bold(`Características especiales: ${funko.specialFeatures}`));
  let marketValueColor = chalk.red;
  if (funko.marketValue > 100) marketValueColor = chalk.green;
  else if (funko.marketValue > 50) marketValueColor = chalk.yellow;
  else if (funko.marketValue > 20) marketValueColor = chalk.blue;
  console.log(chalk.bold(`Valor de mercado: ${marketValueColor(funko.marketValue)}`));
  console.log(chalk.blue('--------------------------------'));
}