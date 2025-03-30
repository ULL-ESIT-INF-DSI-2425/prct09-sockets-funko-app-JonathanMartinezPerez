import yargs from 'yargs';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import { FunkoPop, FunkoType, FunkoGenre } from './funko.js';
import { RequestType, ResponseType } from './types.js';
import { MessageEventEmitterClient } from './eventEmitterClient.js';

const funkoOptions = {
  user: { type: 'string' as const, demandOption: true },
  id: { type: 'number' as const, demandOption: true },
  name: { type: 'string' as const, demandOption: true },
  description: { type: 'string' as const, demandOption: true },
  type: { type: 'string' as const, choices: Object.values(FunkoType), demandOption: true },
  genre: { type: 'string' as const, choices: Object.values(FunkoGenre), demandOption: true },
  franchise: { type: 'string' as const, demandOption: true },
  number: { type: 'number' as const, demandOption: true },
  exclusive: { type: 'boolean' as const, demandOption: true },
  specialFeatures: { type: 'string' as const, demandOption: true },
  marketValue: { type: 'number' as const, demandOption: true }
};

const idOptions = {
  user: { type: 'string' as const, demandOption: true },
  id: { type: 'number' as const, demandOption: true }
};

const userOption = {
  user: { type: 'string' as const, demandOption: true }
};

function createFunkoFromArgs(argv: any): FunkoPop {
  return {
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
}

function sendRequest(request: RequestType) {
  const client = new MessageEventEmitterClient({ port: 60300 });

  // Configurar timeout para desconectar después de 5 segundos
  const timeout = setTimeout(() => {
    console.error(chalk.red('Error: Tiempo de espera agotado'));
    process.exit(1);
  }, 5000);

  client.on('response', (response: ResponseType) => {
    clearTimeout(timeout);
    handleResponse(response);
    process.exit(0);
  });

  client.on('error', (err) => {
    clearTimeout(timeout);
    console.error(chalk.red(`Error de conexión: ${err.message}`));
    process.exit(1);
  });

  client.sendRequest(request);
}

function handleResponse(response: ResponseType) {
  if (response.success) {
    if (response.type === 'list' && response.funkoPops) {
      console.log(chalk.green(`Colección de Funkos:`));
      response.funkoPops.forEach(funko => {
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

// Configuración de yargs
yargs(hideBin(process.argv))
  .scriptName('funko-client')
  .usage('$0 <cmd> [args]')
  .command('add', 'Añade un Funko', funkoOptions, (argv) => {
    sendRequest({
      type: 'add',
      user: argv.user || '',
      funkoPop: createFunkoFromArgs(argv)
    });
  })
  .command('update', 'Actualiza un Funko', funkoOptions, (argv) => {
    sendRequest({
      type: 'update',
      user: argv.user || '',
      funkoPop: createFunkoFromArgs(argv)
    });
  })
  .command('remove', 'Elimina un Funko', idOptions, (argv) => {
    sendRequest({ type: 'remove', user: argv.user || '', id: argv.id });
  })
  .command('read', 'Muestra un Funko', idOptions, (argv) => {
    sendRequest({ type: 'read', user: argv.user || '', id: argv.id });
  })
  .command('list', 'Lista todos los Funkos de un usuario', userOption, (argv) => {
    sendRequest({ type: 'list', user: argv.user || '' });
  })
  .help()
  .parse();