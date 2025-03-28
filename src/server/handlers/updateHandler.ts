import { RequestType, ResponseType } from '../../models/types.js';
import { FileManager } from '../../utils/fileManager.js';

// updateHandler.ts (corregido)
export function handleUpdate(request: RequestType): ResponseType {
  if (request.funkoPop?.id) {
    const existingFunko = FileManager.getFunko(request.user, request.funkoPop.id);
    if (existingFunko) {
      FileManager.saveFunko(request.user, { ...existingFunko, ...request.funkoPop });
      return { success: true, message: 'Funko updated successfully!' };
    }
    return { success: false, message: 'Funko not found.' };
  }
  return { success: false, message: 'Missing Funko ID.' };
}