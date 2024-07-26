import { Entity } from './entities/entity.js';
import { setupCRT } from './lib/crt.js';
import { Img } from './lib/image.js';
import { loadP8 } from "./lib/p8.js";

class Player extends Entity {

}

class Game {

  entities: Entity[] = [];

  player1!: Player;
  player2!: Player;

  constructor(

  ) {

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

const bg = new Entity(0, 0, Img.flatColor(3));
game.entities.push(bg);

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
    const s = map1.map[y][x];
    if (s === 0) {
      continue;
    }
    else if (s === 12) {
      const img = Img.from(map1.pixels, s);
      game.player1 = new Player(x * 8, y * 8, img);
    }
    else if (s === 13) {

    }
    else {
      const img = Img.from(map1.pixels, s);
      new Entity(x * 8, y * 8, img);
    }
  }
}

const crt = setupCRT();

crt.ontick = (t) => {
  crt.pixels.fill(0);

  for (const ent of game.entities) {
    ent.image.draw(crt.pixels, ent.x, ent.y);
  }

  crt.blit();
};

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


// class Point {
//   constructor(public x = 0, public y = 0) { }
// }
// const camera = new Point();

//   // // Update entities
//   // for (const e of entities) {
//   //   if (e.dead) continue;
//   //   e.update?.(t, logic);
//   // }
