// import { Entity, Logic } from "./entities/entity.js";
// import { Player } from "./entities/player.js";
import { setupCRT } from './lib/crt.js';
import { loadCleanP8 } from "./lib/p8.js";

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

const map1 = await loadCleanP8('sheep.p8');

// const entities: Entity[] = [];

// let player1: Player;
// let player2: Player;

// for (let y = 0; y < 64; y++) {
//   for (let x = 0; x < 128; x++) {
//     const tile = map1.map[y][x];
//     if (tile.index > 0) {
//       const px = x * 8;
//       const py = y * 8;
//       const image = tile.sprite.image;

//       let entity;

//       if (tile.sprite.flags.RED) {
//         entity = new Wall(px, py, image);
//       }
//       else if (tile.sprite.flags.ORANGE) {
//         entity = new Wall(px, py, image);
//       }
//       else if (tile.index === 12) {
//         entity = player1 = new Player(px, py, image, 0);
//       }
//       else if (tile.index === 13) {
//         entity = player2 = new Player(px, py, image, 1);
//       }
//       else {
//         entity = new Entity(px, py, image);
//       }

//       entities.push(entity);
//     }
//   }
// }

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

// class Screen {

//   pixels = new Uint16Array(320 * 180 * 4);

// }

// class Point {

//   constructor(public x = 0, public y = 0) { }

// }


// const camera = new Point();

// document.onkeydown = (e) => {
//   if (e.key === 'ArrowRight') {
//     camera.x += 1;
//   }
// };

crt.update = (t) => {

  // camera.x = 0;
  // camera.y = 0;

  // // Update entities
  // for (const e of entities) {
  //   if (e.dead) continue;
  //   e.update?.(t, logic);
  // }

  // // Draw entities
  // for (const e of entities) {
  //   if (e.dead) continue;
  //   e.draw(pixels, 0);
  // }

  for (let y = 0; y < 180; y++) {
    for (let x = 0; x < 320; x++) {
      const i = y * 320 * 4 + x * 4;

      crt.pixels[i + 0] = 0;
      crt.pixels[i + 1] = 0;
      crt.pixels[i + 2] = 100;
      crt.pixels[i + 3] = 255;

    }
  }

  // // Apply drawing to screen
  // for (let p = 0; p < 21 * 8 * 40 * 8 * 4; p += 4) {
  //   const h = pixels[p + 0];
  //   const s = pixels[p + 1];
  //   const l = pixels[p + 2];
  //   const a = pixels[p + 3];
  //   const [r, g, b] = colorConvert.hsl.rgb([h, s, l]);
  //   crt.pixels[p + 0] = r;
  //   crt.pixels[p + 1] = g;
  //   crt.pixels[p + 2] = b;
  //   crt.pixels[p + 3] = a;
  // }

  crt.blit();
};
