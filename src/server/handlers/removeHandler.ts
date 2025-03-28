import { RequestType, ResponseType } from '../../models/types.js';
import { FileManager } from '../../utils/fileManager.js';

export function handleRemove(request: RequestType): ResponseType {
  if (request.id !== undefined) {
    const deleted = FileManager.deleteFunko(request.user, request.id);
    return deleted
      ? { success: true, message: 'Funko removed successfully!' }
      : { success: false, message: 'Funko not found.' };
  } else {
    return { success: false, message: 'Invalid Funko ID.' };
  }
}