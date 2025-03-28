import { sendRequest } from '../client.js';
import chalk from 'chalk';
import { FunkoGenre, FunkoType } from '../../models/funko.js';

export const updateCommand = {
  command: 'update',
  describe: 'Updates an existing Funko in the collection',
  builder: {
    user: { 
      type: 'string', 
      demandOption: true,
      description: 'User name (owner of the collection)'
    },
    id: { 
      type: 'number', 
      demandOption: true,
      description: 'Existing Funko ID to update'
    },
    name: { type: 'string', description: 'New Funko name' },
    description: { type: 'string', description: 'New description' },
    type: { 
      type: 'string', 
      choices: Object.values(FunkoType),
      description: 'New type'
    },
    genre: { 
      type: 'string', 
      choices: Object.values(FunkoGenre),
      description: 'New genre'
    },
    franchise: { type: 'string', description: 'New franchise' },
    number: { type: 'number', description: 'New collection number' },
    exclusive: { type: 'boolean', description: 'Update exclusivity' },
    specialFeatures: { type: 'string', description: 'New features' },
    marketValue: { type: 'number', description: 'New market value' },
  },
  handler: async (argv: any) => {
    try {
      console.log(chalk.yellow('\nProcessing update command...'));
      
      const updateData = {
        id: Number(argv.id),
        ...(argv.name && { name: argv.name.toString() }),
        ...(argv.description && { description: argv.description.toString() }),
        ...(argv.type && { type: argv.type as FunkoType }),
        ...(argv.genre && { genre: argv.genre as FunkoGenre }),
        ...(argv.franchise && { franchise: argv.franchise.toString() }),
        ...(argv.number && { number: Number(argv.number) }),
        ...(argv.exclusive !== undefined && { exclusive: Boolean(argv.exclusive) }),
        ...(argv.specialFeatures && { specialFeatures: argv.specialFeatures.toString() }),
        ...(argv.marketValue && { marketValue: parseFloat(argv.marketValue) })
      };

      console.log(chalk.cyan('\nUpdate data:'));
      console.table([updateData]);

      const response = await sendRequest({
        type: 'update',
        user: argv.user,
        funkoPop: updateData
      });

      response.success 
        ? console.log(chalk.green.bold('\n✓ Success:'), response.message)
        : console.log(chalk.red.bold('\n✗ Error:'), response.message);

    } catch (error) {
      console.log(chalk.red.bold('\n⚠ Update Error:'));
      console.log(chalk.red((error as Error).message));
      process.exit(1);
    } finally {
      console.log(chalk.yellow('\nOperation completed\n'));
    }
  }
};