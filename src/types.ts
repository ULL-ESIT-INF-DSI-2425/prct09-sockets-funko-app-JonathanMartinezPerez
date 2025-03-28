import { FunkoPop } from './funko.js';

/**
 * Tipo para las peticiones del cliente al servidor
 */
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  funkoPop?: FunkoPop;
  id?: number;
}

/**
 * Tipo para las respuestas del servidor al cliente
 */
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  message?: string;
  funkoPops?: FunkoPop[];
}