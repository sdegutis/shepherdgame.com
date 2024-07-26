import { Entity } from './entities/entity.js';
import { Player } from './entities/player.js';
import { convertHslToRgb } from './lib/color.js';
import { CRT } from './lib/crt.js';

export class Game {

  entityGrid: Set<Entity>[][] = [];
  liveEntities = new Set<Entity>();

  pixels = new Uint16Array(320 * 180 * 4);

  players: Player[] = [];
  camera = { x: 0, y: 0 };
  entPoint = { x: 0, y: 0 };

  constructor(private crt: CRT) {
    document.onkeydown = (e) => {
      if (e.key === 'ArrowRight') this.players[0].x += 1;
      if (e.key === 'ArrowLeft') this.players[0].x -= 1;
      if (e.key === 'ArrowDown') this.players[0].y += 1;
      if (e.key === 'ArrowUp') this.players[0].y -= 1;
      this.moved();
    };
  }

  start() {
    this.moved();

    this.crt.ontick = (t) => {
      this.pixels.fill(0);

      for (const ent of this.liveEntities) {
        ent.update?.(t);
      }

      for (let i = 0; i < 3; i++) {
        if (i === 2) {
          for (let i = 0; i < 320 * 180 * 4; i += 4) {
            this.pixels[i + 3] = Math.max(0, this.pixels[i + 3] - 200);
          }
        }

        for (const ent of this.liveEntities) {
          ent.draw(i);
        }
      }

      for (let i = 0; i < 320 * 180 * 4; i += 4) {
        convertHslToRgb(this.pixels, i, this.crt.pixels);
        this.crt.pixels[i + 3] = this.pixels[i + 3];
      }

      this.crt.blit();
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
        this.entityGrid[y + yy] ??= [];
        this.entityGrid[y + yy][x + xx] ??= new Set();
        this.entityGrid[y + yy][x + xx].add(entity);
      }
    }
  }

  moved() {
    const x = (this.players[0].x + (this.players[0].image.w / 2) + this.players[1].x + (this.players[1].image.w / 2)) / 2;
    const y = (this.players[0].y + (this.players[0].image.h / 2) + this.players[1].y + (this.players[1].image.h / 2)) / 2;

    this.camera.x = x - 160;
    this.camera.y = y - 90;

    const ex = Math.floor(this.camera.x / 8);
    const ey = Math.floor(this.camera.y / 8);

    if (this.entPoint.x !== ex || this.entPoint.y !== ey) {
      this.entPoint = { x: ex, y: ey };

      this.liveEntities.clear();

      for (let y = -1; y < 24; y++) {
        for (let x = -1; x < 41; x++) {
          const cell = this.entityGrid[y + this.entPoint.y]?.[x + this.entPoint.x];
          if (!cell) continue;

          for (const ent of cell) {
            this.liveEntities.add(ent);
          }
        }
      }
    }
  }

}
