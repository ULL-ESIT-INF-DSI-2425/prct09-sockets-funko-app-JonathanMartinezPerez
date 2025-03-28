import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import './client/commands/add.js';
import './client/commands/delete.js';
import './client/commands/update.js';
import './client/commands/list.js';
import './client/commands/find.js';

/**
 * Yargs para gestionar todos los comandos.
 */
yargs(hideBin(process.argv))
  .scriptName('funko-app')
  .usage('$0 <cmd> [args]')
  .help()
  .parse();