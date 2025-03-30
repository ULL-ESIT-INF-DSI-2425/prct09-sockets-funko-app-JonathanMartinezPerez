/**
 * Enumerado para los tipos de Funko
 * - POP: Pop!
 * - POP_RIDES: Pop! Rides
 * - VINYL_SODA: Vynil Soda
 * - VINYL_GOLD: Vynil Gold
 */
export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VINYL_SODA = "Vynil Soda",
  VINYL_GOLD = "Vynil Gold",
}

/**
 * Enumerado para los géneros de Funko
 * - ANIMATION: Animación
 * - MOVIES_TV: Películas y TV
 * - VIDEOGAMES: Videojuegos
 * - SPORTS: Deportes
 * - MUSIC: Música
 * - ANIME: Ánime
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
 * - id: id del Funko Pop
 * - name: nombre del Funko Pop
 * - description: descripción del Funko Pop
 * - type: tipo del Funko Pop
 * - genre: género del Funko Pop
 * - franchise: franquicia del Funko Pop
 * - number: número del Funko Pop
 * - exclusive: si es exclusivo o no
 * - specialFeatures: características especiales del Funko Pop
 * - marketValue: valor de mercado del Funko Pop
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