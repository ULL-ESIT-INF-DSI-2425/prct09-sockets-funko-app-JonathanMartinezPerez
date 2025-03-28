import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "./commands/add.js";
import "./commands/delete.js";
import "./commands/update.js";
import "./commands/list.js";
import "./commands/find.js";
/** 
 * Yargs para gestionar todos los comandos.
 */
yargs(hideBin(process.argv))
  .scriptName("funko-app")
  .usage("$0 <cmd> [args]")
  .help()
  .parse();