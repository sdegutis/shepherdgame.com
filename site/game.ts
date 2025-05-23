import { Entity } from './entities/entity.js';
import { Player } from './entities/player.js';
import { Solid } from './entities/solid.js';
import { convertHslToRgb } from './lib/color.js';
import { CRT, setupCRT } from './lib/crt.js';
import { Grid, Point, Tile } from './lib/grid.js';
import { Img } from './lib/image.js';
import { loadP8 } from './lib/p8.js';

export class Game {

  grid = new Grid(128, 64);
  liveTiles = new Set<Tile>();
  liveEntities = new Set<Entity>();

  pixels = new Uint16Array(320 * 180 * 4);

  players: Player[] = [];
  camera = new Point(0, 0);
  entPoint = new Point(0, 0);

  constructor(public crt: CRT) { }

  async load() {
    const map1 = await loadP8('sheep.p8');

    new Entity(this, 0, 0, Img.flatColor(3));

    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 128; x++) {
        const s = map1.map[y][x];
        if (s === 0) {
          continue;
        }
        else if (s === 12) {
          new Player(this, x * 8, y * 8, map1.pixels, s, 0);
        }
        else if (s === 13) {
          new Player(this, x * 8, y * 8, map1.pixels, s, 1);
        }
        else if (s === 8) {
          // bees
        }
        else if (s === 9) {
          // sheep
        }
        else if (map1.flags[s].RED) {
          new Solid(this, x * 8, y * 8, map1.pixels, s);
        }
        else {
          const img = Img.from(map1.pixels, s);
          new Entity(this, x * 8, y * 8, img);
        }
      }
    }
  }

  start() {
    this.moveCamera();

    this.crt.ontick = (t) => {
      this.pixels.fill(0);

      for (const ent of this.liveEntities) {
        ent.update?.(t);
      }

      for (let i = 0; i < 3; i++) {
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

  putEntity(entity: Entity) {
    for (const tile of entity.inTiles) {
      tile.rem(entity);
    }

    const x = Math.floor(entity.x / 8);
    const y = Math.floor(entity.y / 8);

    for (let yy = 0; yy < Math.floor(entity.image.h / 8); yy++) {
      for (let xx = 0; xx < Math.floor(entity.image.w / 8); xx++) {
        // const x3 = x + xx + Math.floor((entity.image.w - 1) / 8);
        // const y3 = y + yy + Math.floor((entity.image.h - 1) / 8);

        this.grid.get(x + xx, y + yy).add(entity);


        // this.grid.get(endx, endy).add(entity);
        // this.grid.get(x, endy).add(entity);
        // this.grid.get(endx, y).add(entity);
      }
    }
  }

  moveCamera() {
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
          const cell = this.grid.get(x + this.entPoint.x, y + this.entPoint.y);

          for (const ent of cell.entities) {
            this.liveEntities.add(ent);
          }
        }
      }
    }
  }

}

const crt = setupCRT();
const game = new Game(crt);
await game.load();
game.start();

// plans:

// 0 = night
// 1 = water
// 2 = leaves
// 3 = grass
// 4 = dirt
// 5 = rocky
// 6 = ice
// 7 = snow
// 8 = red leaves?
// 9 = magma
// 10 = autumn grass
// 11 = light grass
// 12 = shallow water
// 13 = concrete?
// 15 = sand
