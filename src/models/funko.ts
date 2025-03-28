/**
 * Enumerado que representa los tipos de figuras Funko.
 * @interface
 * @property {string} POP Pop!
 * @property {string} POP_RIDES Pop! Rides
 * @property {string} VYNIL_SODA Vynil Soda
 * @property {string} VYNIL_GOLD Vynil Gold
 */
export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold"
}

/**
 * Enumerado que representa los géneros de figuras Funko.
 * @interface
 * @property {string} ANIMATION Animación.
 * @property {string} MOVIES_TV Películas y TV.
 * @property {string} VIDEO_GAMES Videojuegos.
 * @property {string} SPORTS Deportes.
 * @property {string} MUSIC Música.
 * @property {string} ANIME Ánime.
 */	
export enum FunkoGenre {
  ANIMATION = "Animación",
  MOVIES_TV = "Películas y TV",
  VIDEO_GAMES = "Videojuegos",
  SPORTS = "Deportes",
  MUSIC = "Música",
  ANIME = "Ánime"
}

/**
 * Interfaz que representa una figura Funko.
 * @interface
 * @property {number} id Identificador de la figura.
 * @property {string} name Nombre de la figura.
 * @property {string} description Descripción de la figura.
 * @property {FunkoType} type Tipo de la figura.
 * @property {FunkoGenre} genre Género de la figura.
 * @property {string} franchise Franquicia a la que pertenece la figura.
 * @property {number} number Número de la figura.
 * @property {boolean} exclusive Indica si la figura es exclusiva.
 * @property {string} specialFeatures Características especiales de la figura.
 * @property {number} marketValue Valor de mercado de la figura.
 */
export interface Funko {
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
