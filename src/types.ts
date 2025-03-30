import { FunkoPop } from './funko.js';

/**
 * Tipo para las peticiones del cliente al servidor
 * - type: tipo de la petición
 * - user: usuario que realiza la petición
 * - funkoPop: Funko Pop a añadir, actualizar o eliminar
 * - id: id del Funko Pop a leer o eliminar
 */
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  funkoPop?: FunkoPop;
  id?: number;
}

/**
 * Tipo para las respuestas del servidor al cliente
 * - type: tipo de la petición
 * - success: si la petición fue exitosa o no
 * - message: mensaje de error o éxito
 * - funkoPops: lista de Funko Pops
 */
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list' | 'error';
  success: boolean;
  message?: string;
  funkoPops?: FunkoPop[];
}