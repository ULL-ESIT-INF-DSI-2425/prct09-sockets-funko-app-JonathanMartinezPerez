import { sendRequest } from '../client.js';
import chalk from 'chalk';

export const listCommand = {
  command: 'list',
  describe: 'Lists all Funkos in a user collection',
  builder: {
    user: { 
      type: 'string', 
      demandOption: true,
      description: 'User name to list collection'
    }
  },
  handler: async (argv: any) => {
    try {
      console.log(chalk.yellow(`\nFetching collection for ${argv.user}...`));
      
      const response = await sendRequest({
        type: 'list',
        user: argv.user
      });

      if (response.success && response.funkoPops?.length) {
        console.log(chalk.green.bold(`\n✓ Collection (${response.funkoPops.length} items):`));
        response.funkoPops.forEach(funko => {
          console.log(chalk.cyan('-'.repeat(40)));
          console.log(`ID: ${chalk.bold(funko.id)}`);
          console.log(`Name: ${funko.name}`);
          console.log(`Value: ${chalk.green(`$${funko.marketValue}`)}`);
          console.log(`Exclusive: ${funko.exclusive ? chalk.red('Yes') : 'No'}`);
        });
      } else {
        console.log(chalk.yellow.bold('\nCollection is empty'));
      }

    } catch (error) {
      console.log(chalk.red.bold('\n⚠ Listing Error:'));
      console.log(chalk.red((error as Error).message));
      process.exit(1);
    } finally {
      console.log(chalk.yellow('\nOperation completed\n'));
    }
  }
};