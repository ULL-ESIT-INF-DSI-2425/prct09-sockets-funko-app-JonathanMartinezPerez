import { Funko } from './funko.js';

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'find' | 'list';
  user: string;
  funkoPop?: Funko;
  id?: number;
};

export type ResponseType = {
  success: boolean;
  message: string;
  funkoPops?: Funko[];
};