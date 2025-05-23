import { Entity } from "../entities/entity.js";

export class Point {

  constructor(
    public x: number,
    public y: number,
  ) { }

}

export class Tile {

  entities = new Set<Entity>();

  add(ent: Entity) {
    this.entities.add(ent);
    ent.inTiles.add(this);
  }

  rem(ent: Entity) {
    this.entities.delete(ent);
    ent.inTiles.delete(this);
  }

}

export class Grid {

  #tiles: Tile[][] = [];

  constructor(
    public width: number,
    public height: number,
  ) {
    for (let y = 0; y < height; y++) {
      this.#tiles[y] = [];
      for (let x = 0; x < width; x++) {
        this.#tiles[y][x] = new Tile();
      }
    }
  }

  get(x: number, y: number) {
    return this.#tiles[y][x];
  }

}
