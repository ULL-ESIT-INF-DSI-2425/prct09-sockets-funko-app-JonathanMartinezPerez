import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import chalk from "chalk";

/**
 * Comando de yargs que elimina una figura Funko.
 */
export const deleteCommand = yargs(hideBin(process.argv))
  .command(
    "delete",
    "Deletes a Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
    },
    (argv) => {
      const success = FileManager.deleteFunko(argv.user, argv.id);
      if (success) {
        console.log(chalk.green("Funko deleted successfully!"));
      } else {
        console.log(chalk.red("Funko not found!"));
      }
    }
  )
  .help()
  .argv;