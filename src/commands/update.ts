import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FileManager } from "../utils/fileManager.js";
import { Funko, FunkoType, FunkoGenre } from "../models/funko.js";
import chalk from "chalk";

/**
 * Valida si un Funko existe y devuelve un objeto actualizado.
 */
export function getUpdatedFunko(
  user: string,
  id: number,
  updates: Partial<Funko>
): Funko | null {
  const existingFunko = FileManager.getFunko(user, id);

  if (!existingFunko) {
    console.log(chalk.red("Funko not found!"));
    return null;
  }

  return {
    ...existingFunko, // Mantener valores anteriores
    ...(updates.name && { name: updates.name }),
    ...(updates.description && { description: updates.description }),
    ...(updates.type && { type: updates.type }),
    ...(updates.genre && { genre: updates.genre }),
    ...(updates.franchise && { franchise: updates.franchise }),
    ...(updates.number && { number: updates.number }),
    ...(updates.exclusive !== undefined && { exclusive: updates.exclusive }),
    ...(updates.specialFeatures && { specialFeatures: updates.specialFeatures }),
    ...(updates.marketValue && { marketValue: updates.marketValue }),
  };
}

/**
 * Comando de yargs que actualiza un Funko.
 */
export const updateCommand = yargs(hideBin(process.argv))
  .command(
    "update",
    "Updates a Funko",
    {
      user: { type: "string", demandOption: true },
      id: { type: "number", demandOption: true },
      name: { type: "string" },
      description: { type: "string" },
      type: { type: "string" },
      genre: { type: "string" },
      franchise: { type: "string" },
      number: { type: "number" },
      exclusive: { type: "boolean" },
      specialFeatures: { type: "string" },
      marketValue: { type: "number" },
    },
    (argv) => {
      const updates = {
        name: argv.name,
        description: argv.description,
        type: argv.type as FunkoType | undefined,
        genre: argv.genre as FunkoGenre | undefined,
        franchise: argv.franchise,
        number: argv.number,
        exclusive: argv.exclusive,
        specialFeatures: argv.specialFeatures,
        marketValue: argv.marketValue,
      };

      const updatedFunko = getUpdatedFunko(argv.user, argv.id, updates);

      if (!updatedFunko) return;

      FileManager.saveFunko(argv.user, updatedFunko);
      console.log(chalk.green("Funko updated successfully!"));
    }
  )
  .help()
  .argv;
