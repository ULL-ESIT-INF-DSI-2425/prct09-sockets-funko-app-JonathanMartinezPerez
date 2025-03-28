import { sendRequest } from '../client.js';
import chalk from 'chalk';
import { FunkoGenre, FunkoType } from '../../models/funko.js';

export const addCommand = {
  command: 'add',
  describe: 'Adds a Funko to a user\'s collection',
  builder: {
    user: { 
      type: 'string', 
      demandOption: true,
      description: 'User name (owner of the collection)'
    },
    id: { 
      type: 'number', 
      demandOption: true,
      description: 'Unique Funko ID number'
    },
    name: { 
      type: 'string', 
      demandOption: true,
      description: 'Funko name'
    },
    description: { 
      type: 'string', 
      demandOption: true,
      description: 'Detailed description of the Funko'
    },
    type: { 
      type: 'string', 
      demandOption: true,
      choices: Object.values(FunkoType),
      description: 'Type of Funko (use exact values from list)'
    },
    genre: { 
      type: 'string', 
      demandOption: true,
      choices: Object.values(FunkoGenre),
      description: 'Genre category (use exact values from list)'
    },
    franchise: { 
      type: 'string', 
      demandOption: true,
      description: 'Original franchise/property'
    },
    number: { 
      type: 'number', 
      demandOption: true,
      description: 'Sequential number in the collection'
    },
    exclusive: { 
      type: 'boolean', 
      demandOption: true,
      description: 'Is it an exclusive edition? (true/false)'
    },
    specialFeatures: { 
      type: 'string', 
      demandOption: true,
      description: 'Special features or notes'
    },
    marketValue: { 
      type: 'number', 
      demandOption: true,
      description: 'Current market value in USD'
    },
  },
  handler: async (argv: any) => {
    try {
      console.log(chalk.yellow('\nProcessing add command...'));
      
      // Convertir valores a los tipos correctos
      const funkoData = {
        id: Number(argv.id),
        name: argv.name.toString(),
        description: argv.description.toString(),
        type: argv.type as FunkoType,
        genre: argv.genre as FunkoGenre,
        franchise: argv.franchise.toString(),
        number: Number(argv.number),
        exclusive: Boolean(argv.exclusive),
        specialFeatures: argv.specialFeatures.toString(),
        marketValue: parseFloat(argv.marketValue)
      };

      console.log(chalk.cyan('\nSending Funko data:'));
      console.table([funkoData]);

      const response = await sendRequest({
        type: 'add',
        user: argv.user,
        funkoPop: {
          id: funkoData.id,
          name: funkoData.name,
          description: funkoData.description,
          type: funkoData.type,
          genre: funkoData.genre,
          franchise: funkoData.franchise,
          number: funkoData.number,
          exclusive: funkoData.exclusive,
          specialFeatures: funkoData.specialFeatures,
          marketValue: funkoData.marketValue
        }
      });

      if (response.success) {
        console.log(chalk.green.bold('\n✓ Success:'), response.message);
        console.log(chalk.cyan(`New Funko ID: ${funkoData.id}`));
      } else {
        console.log(chalk.red.bold('\n✗ Error:'), response.message);
      }

    } catch (error) {
      console.log(chalk.red.bold('\n⚠ Critical Error:'));
      console.log(chalk.red((error as Error).message));
      process.exit(1);
    } finally {
      console.log(chalk.yellow('\nOperation completed\n'));
    }
  }
};