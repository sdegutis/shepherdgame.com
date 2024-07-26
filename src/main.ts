import { Entity } from './entities/entity.js';
import { Player } from './entities/player.js';
import { setupCRT } from './lib/crt.js';
import { Img } from './lib/image.js';
import { loadP8 } from "./lib/p8.js";

class Camera {
  x = 0;
  y = 0;
}

class Game {

  entities: Set<Entity>[][] = [];

  players: Player[] = [];
  camera = new Camera();

  constructor() { }

  putEntity(entity: Entity, x: number, y: number) {
    x = Math.floor(x / 8);
    y = Math.floor(y / 8);
    this.entities[y] ??= [];
    this.entities[y][x] ??= new Set();
    this.entities[y][x].add(entity);
  }

  updateEntities(t: number) {

    // for (const e of this.entities) {
    //   e.update?.(t);
    // }
  }

  drawEntities(pixels: Uint8ClampedArray) {

    for (let y = -1; y < 23; y++) {
      for (let x = -1; x < 40; x++) {
        const row = this.entities[y + this.camera.y];
        if (!row) continue;

        const cell = row[x + this.camera.x];
        if (!cell) continue;

        for (const ent of cell) {
          ent.image.draw(pixels, ent.x - this.camera.x, ent.y - this.camera.y);
        }
      }
    }
  }

}

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

export const game = new Game();

const map1 = await loadP8('sheep.p8');

new Entity(0, 0, Img.flatColor(3));

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
    const s = map1.map[y][x];
    if (s === 0) {
      continue;
    }
    else if (s === 12) {
      new Player(x * 8, y * 8, 0, map1.pixels, s);
    }
    else if (s === 13) {
      new Player(x * 8, y * 8, 1, map1.pixels, s);
    }
    // else if (map1.flags[s].RED) {

    // }
    else {
      const img = Img.from(map1.pixels, s);
      new Entity(x * 8, y * 8, img);
    }
  }
}

const crt = setupCRT();
crt.ontick = (t) => {
  crt.pixels.fill(0);
  game.updateEntities(t);
  game.drawEntities(crt.pixels);
  crt.blit();
};

// const logic: Logic = {
//   tryMove: (movingEntity, x, y) => {
//     movingEntity.x += x;
//     movingEntity.y += y;

//     let canMove = true;
//     for (let i = 0; i < entities.length; i++) {
//       const collidedInto = entities[i];
//       if (
//         movingEntity.x + 7 >= collidedInto.x &&
//         movingEntity.y + 7 >= collidedInto.y &&
//         movingEntity.x <= collidedInto.x + 7 &&
//         movingEntity.y <= collidedInto.y + 7
//       ) {
//         if (collidedInto === movingEntity) continue;
//         if (collidedInto.dead) continue;
//         if (!movingEntity.collideWith) continue;

//         const result = movingEntity.collideWith(collidedInto, x, y);
//         if (result === 'stop') {
//           canMove = false;
//           break;
//         }
//       }
//     }

//     if (!canMove) {
//       movingEntity.x -= x;
//       movingEntity.y -= y;
//     }

//     return canMove;
//   },

// };
