import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../models/funko.js";
import chalk from "chalk";

/**
 * Añade una figura Funko.
 * @param {string} user Nombre del usuario.
 * @param {Funko} funko Figura Funko a añadir.
 * @returns {void}
 */
export function addFunko(user: string, funko: Funko) {
  const existingFunko = FileManager.getFunko(user, funko.id);
  if (existingFunko) {
    throw new Error(`El Funko con ID ${funko.id} ya existe.`);
  }
  FileManager.saveFunko(user, funko);
}

/**
 * Comando de yargs que añade una figura Funko.
 */
export const addCommand = yargs(hideBin(process.argv))
  .command(
    "add",
    "Adds a Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
      name: { type: "string", demandOption: true },
      description: { type: "string", demandOption: true },
      type: { type: "string", demandOption: true },
      genre: { type: "string", demandOption: true },
      franchise: { type: "string", demandOption: true },
      number: { type: "number", demandOption: true },
      exclusive: { type: "boolean", demandOption: true },
      specialFeatures: { type: "string", demandOption: true },
      marketValue: { type: "number", demandOption: true },
    },
    (argv) => {
      if (FileManager.getFunko(argv.user, argv.id)) {
        console.log(chalk.red("Funko already exists!"));
      } else {
        const funko: Funko = {
          id: argv.id,
          name: argv.name,
          description: argv.description,
          type: argv.type as FunkoType,
          genre: argv.genre as FunkoGenre,
          franchise: argv.franchise,
          number: argv.number,
          exclusive: argv.exclusive,
          specialFeatures: argv.specialFeatures,
          marketValue: argv.marketValue,
        };

        FileManager.saveFunko(argv.user, funko);
        console.log(chalk.green("Funko added successfully!"));
      }
    }
  )
  .help()
  .argv;
