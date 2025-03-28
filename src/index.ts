import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import "./commands/client.js";
/** 
 * Yargs para gestionar todos los comandos.
 */
yargs(hideBin(process.argv))
  .scriptName("funko-app")
  .usage("$0 <cmd> [args]")
  .help()
  .parse();