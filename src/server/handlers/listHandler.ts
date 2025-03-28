import { RequestType, ResponseType } from '../../models/types.js';
import { FileManager } from '../../utils/fileManager.js';

export function handleList(request: RequestType): ResponseType {
  const funkos = FileManager.loadFunkos(request.user);
  return {
    success: true,
    message: funkos.length > 0 ? 'Funko list retrieved.' : 'No Funkos found.',
    funkoPops: funkos,
  };
}