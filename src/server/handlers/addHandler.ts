import { RequestType, ResponseType } from '../../models/types.js';
import { FileManager } from '../../utils/fileManager.js';

// addHandler.ts (mejorado)
export function handleAdd(request: RequestType): ResponseType {
  if (!request.funkoPop) {
    return { success: false, message: 'No Funko data provided' };
  }

  if (FileManager.getFunko(request.user, request.funkoPop.id)) {
    return { 
      success: false, 
      message: `Funko with ID ${request.funkoPop.id} already exists` 
    };
  }

  try {
    FileManager.saveFunko(request.user, request.funkoPop);
    return { 
      success: true, 
      message: `Funko "${request.funkoPop.name}" added successfully!` 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Error saving Funko: ${(error as Error).message}` 
    };
  }
}