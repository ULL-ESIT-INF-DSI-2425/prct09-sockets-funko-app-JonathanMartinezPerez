import { sendRequest } from '../client.js';
import chalk from 'chalk';

export const deleteCommand = {
  command: 'remove',
  describe: 'Removes a Funko from the collection',
  builder: {
    user: { 
      type: 'string', 
      demandOption: true,
      description: 'User name (owner of the collection)'
    },
    id: { 
      type: 'number', 
      demandOption: true,
      description: 'ID of Funko to remove'
    }
  },
  handler: async (argv: any) => {
    try {
      console.log(chalk.yellow(`\nAttempting to remove Funko ID ${argv.id}...`));
      
      const response = await sendRequest({
        type: 'remove',
        user: argv.user,
        id: Number(argv.id)
      });

      if (response.success) {
        console.log(chalk.green.bold('\n✓ Success:'), response.message);
        console.log(chalk.cyan(`Removed Funko ID: ${argv.id}`));
      } else {
        console.log(chalk.red.bold('\n✗ Error:'), response.message);
      }

    } catch (error) {
      console.log(chalk.red.bold('\n⚠ Deletion Error:'));
      console.log(chalk.red((error as Error).message));
      process.exit(1);
    } finally {
      console.log(chalk.yellow('\nOperation completed\n'));
    }
  }
};