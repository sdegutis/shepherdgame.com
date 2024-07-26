import { Entity } from './entities/entity.js';
import { Player } from './entities/player.js';

class Point {
  x = 0;
  y = 0;

  isSame(p: Point) {
    return this.x === p.x && this.y === p.y;
  }
}

export class Game {

  entities: Set<Entity>[][] = [];
  liveEntities = new Set<Entity>();

  players: Player[] = [];
  camera = { x: 0, y: 0 };

  entPoint = new Point();

  constructor() {
    document.onkeydown = (e) => {
      if (e.key === 'ArrowRight') this.camera.x += 1;
      if (e.key === 'ArrowLeft') this.camera.x -= 1;
      if (e.key === 'ArrowDown') this.camera.y += 1;
      if (e.key === 'ArrowUp') this.camera.y -= 1;

      const entPoint = new Point();

      entPoint.x = Math.floor(this.camera.x / 8);
      entPoint.y = Math.floor(this.camera.y / 8);

      if (!this.entPoint.isSame(entPoint)) {
        this.entPoint = entPoint;
        this.resetLiveEntities();
      }
    };
  }

  putEntity(entity: Entity, x: number, y: number) {
    for (const set of entity.inSets) {
      set.delete(entity);
    }

    x = Math.floor(x / 8);
    y = Math.floor(y / 8);

    for (let yy = 0; yy < entity.image.h / 8; yy++) {
      for (let xx = 0; xx < entity.image.w / 8; xx++) {
        this.entities[y + yy] ??= [];
        this.entities[y + yy][x + xx] ??= new Set();
        this.entities[y + yy][x + xx].add(entity);
      }
    }
  }

  resetLiveEntities() {
    this.liveEntities.clear();

    for (let y = -1; y < 24; y++) {
      for (let x = -1; x < 41; x++) {
        const cell = this.entities[y + this.entPoint.y]?.[x + this.entPoint.x];
        if (!cell) continue;

        for (const ent of cell) {
          this.liveEntities.add(ent);
        }
      }
    }

  }

  updateEntities(t: number) {
    for (const ent of this.liveEntities) {
      ent.update?.(t);
    }
  }

  drawEntities(pixels: Uint8ClampedArray) {
    for (const ent of this.liveEntities) {
      ent.image.draw(pixels, ent.x - this.camera.x, ent.y - this.camera.y);
    }
  }

}
