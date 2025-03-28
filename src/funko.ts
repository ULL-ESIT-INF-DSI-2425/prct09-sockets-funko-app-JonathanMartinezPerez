/**
 * Enumerado para los tipos de Funko
 */
export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VINYL_SODA = "Vynil Soda",
  VINYL_GOLD = "Vynil Gold",
}

/**
 * Enumerado para los géneros de Funko
 */
export enum FunkoGenre {
  ANIMATION = "Animación",
  MOVIES_TV = "Películas y TV",
  VIDEOGAMES = "Videojuegos",
  SPORTS = "Deportes",
  MUSIC = "Música",
  ANIME = "Ánime",
}

/**
 * Interfaz para representar un Funko Pop
 */
export interface FunkoPop {
  id: number;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
}