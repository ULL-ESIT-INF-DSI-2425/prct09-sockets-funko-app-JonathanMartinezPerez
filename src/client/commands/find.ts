import { sendRequest } from '../client.js';
import chalk from 'chalk';

export const findCommand = {
  command: 'find',
  describe: 'Finds a specific Funko by ID',
  builder: {
    user: { 
      type: 'string', 
      demandOption: true,
      description: 'User name (owner of the collection)'
    },
    id: { 
      type: 'number', 
      demandOption: true,
      description: 'Funko ID to search for'
    }
  },
  handler: async (argv: any) => {
    try {
      console.log(chalk.yellow(`\nSearching for Funko ID ${argv.id}...`));
      
      const response = await sendRequest({
        type: 'find',
        user: argv.user,
        id: Number(argv.id)
      });

      if (response.success) {
        console.log(chalk.green.bold('\n✓ Funko Found:'));
        console.log(chalk.cyan(JSON.stringify(response.funkoPops?.[0], null, 2)));
      } else {
        console.log(chalk.red.bold('\n✗ Not Found:'), response.message);
      }

    } catch (error) {
      console.log(chalk.red.bold('\n⚠ Search Error:'));
      console.log(chalk.red((error as Error).message));
      process.exit(1);
    } finally {
      console.log(chalk.yellow('\nOperation completed\n'));
    }
  }
};