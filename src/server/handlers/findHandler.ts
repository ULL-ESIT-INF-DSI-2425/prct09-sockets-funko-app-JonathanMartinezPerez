import { RequestType, ResponseType } from '../../models/types.js';
import { FileManager } from '../../utils/fileManager.js';

export function handleFind(request: RequestType): ResponseType {
  if (request.id !== undefined) {
    const funko = FileManager.getFunko(request.user, request.id);
    return funko
      ? { success: true, message: 'Funko found.', funkoPops: [funko] }
      : { success: false, message: 'Funko not found.' };
  } else {
    return { success: false, message: 'Invalid Funko ID.' };
  }
}