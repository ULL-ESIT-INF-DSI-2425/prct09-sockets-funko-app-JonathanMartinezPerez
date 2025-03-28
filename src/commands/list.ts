import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import chalk from "chalk";

/**
 * Comando de yargs que lista todas las figuras Funko de un usuario.
 */
export const listCommand = yargs(hideBin(process.argv))
  .command(
    "list",
    "Lists all Funkos for a user",
    {
      user: { type: "string", demandOption: true },
    },
    (argv) => {
      const funkos = FileManager.loadFunkos(argv.user);
      if (funkos.length === 0) {
        console.log(chalk.yellow("No Funkos found for this user."));
      } else {
        console.log(chalk.green(`Funkos for user ${argv.user}:`));
        funkos.forEach((funko) => {
          console.log(JSON.stringify(funko, null, 2));
        });
      }
    }
  )
  .help()
  .argv;