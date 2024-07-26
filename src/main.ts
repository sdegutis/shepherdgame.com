import { Entity } from './entities/entity.js';
import { Player } from './entities/player.js';
import { Solid } from './entities/solid.js';
import { Game } from './game.js';
import { setupCRT } from './lib/crt.js';
import { Img } from './lib/image.js';
import { loadP8 } from "./lib/p8.js";

const crt = setupCRT();

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

export const game = new Game(crt);

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
    else if (s === 8) {
      // bees
    }
    else if (s === 9) {
      // sheep
    }
    else if (map1.flags[s].RED) {
      new Solid(x * 8, y * 8, map1.pixels, s);
    }
    else {
      const img = Img.from(map1.pixels, s);
      new Entity(x * 8, y * 8, img);
    }
  }
}

game.start();

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
