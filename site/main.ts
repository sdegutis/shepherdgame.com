import { Game } from './game.js';
import { setupCRT } from './lib/crt.js';

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
await game.load();
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
