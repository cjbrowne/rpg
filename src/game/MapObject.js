export class MapObject {
    logo = "unknown.png";
    name = "map object";
}


export class Forest extends MapObject {
    logo = "forest.png";
    name = "forest";
}

export class Town extends MapObject {
    logo = "town.png";
    name = "town";
}


export const WATER = Symbol('WATER');
export const GRASS = Symbol('GRASS');
export const ROCK = Symbol('ROCK');