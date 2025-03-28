import fs from "fs";
import path from "path";
import { Funko } from "../models/funko.js";

/**
 * Clase que gestiona la lectura y escritura de figuras Funko en disco.
 * @class FileManager
 */
export class FileManager {
  /**
   * Devuelve la ruta del directorio de un usuario.
   * @param {string} user Nombre del usuario.
   * @returns {string} Ruta del directorio del usuario.
   */
  static getUserDir(user: string): string {
    return path.join("data", user);
  }

  /**
   * Guarda una figura Funko en disco.
   * @param {string} user Nombre del usuario.
   * @param {Funko} funko Figura Funko a guardar.
   * @returns {void}
   */
  static saveFunko(user: string, funko: Funko): void {
    const dir = FileManager.getUserDir(user);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(
      path.join(dir, `${funko.id}.json`),
      JSON.stringify(funko, null, 2)
    );
  }

  /**
   * Carga las figuras Funko de un usuario.
   * @param {string} user Nombre del usuario.
   * @returns {Funko[]} Lista de figuras Funko.
   */
  static loadFunkos(user: string): Funko[] {
    const dir = FileManager.getUserDir(user);
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir)
      .map(file => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as Funko);
  }

  /**
   * Elimina una figura Funko de un usuario.
   * @param {string} user Nombre del usuario.
   * @param {number} id Identificador de la figura.
   * @returns {boolean} Indica si la figura se ha eliminado correctamente.
   */
  static deleteFunko(user: string, id: number): boolean {
    const filePath = path.join(FileManager.getUserDir(user), `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  /**
   * Obtiene una figura Funko de un usuario.
   * @param {string} user Nombre del usuario.
   * @param {number} id Identificador de la figura.
   * @returns {Funko | null} Figura Funko o null si no existe.
   */
  static getFunko(user: string, id: number): Funko | null {
    const filePath = path.join(FileManager.getUserDir(user), `${id}.json`);
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) as Funko : null;
  }
}