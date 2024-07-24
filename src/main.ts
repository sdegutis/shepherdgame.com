import colorConvert from 'https://cdn.jsdelivr.net/npm/color-convert@2.0.1/+esm';
import { Bubble } from "./entities/bubble.js";
import { BubbleWand } from "./entities/bubblewand.js";
import { Elevator } from './entities/elevator.js';
import { Entity, Logic } from "./entities/entity.js";
import { Player } from "./entities/player.js";
import { Wall } from "./entities/wall.js";
import { createCanvas, runGameLoop } from "./lib/core.js";
import { loadCleanP8, MapTile } from "./lib/pico8.js";

const screen = createCanvas();
const engine = runGameLoop();

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

const map1 = await loadCleanP8('src/explore.p8');

const entities: Entity[] = [];

const player1 = createPlayer(0);
const player2 = createPlayer(1);

function createPlayer(playerIndex: number) {
  const px = 20 * 8;
  const py = 10 * 8;

  const image = map1.sprites[(playerIndex + 1) * 16].image;

  const bubble = new Bubble(0, 0, map1.sprites[5].image, map1.sprites[21].image);
  bubble.layer = 1;
  entities.push(bubble);

  const entity = new Player(px, py, image, playerIndex, bubble);
  entity.layer = 2;
  entities.push(entity);
}

function createEntity(tile: MapTile, x: number, y: number) {
  const px = x * 8;
  const py = y * 8;
  const image = tile.sprite.image;

  let entity;

  if (tile.sprite.flags.RED) {
    entity = new Wall(px, py, image);
  }
  else if (tile.sprite.flags.ORANGE) {
    entity = new Wall(px, py, image);
    entity.jumpThrough = true;
  }
  else if (tile.index === 4) {
    entity = new BubbleWand(px, py, image);
    entity.layer = 2;
  }
  else if (tile.index === 6) {
    entity = new Elevator(px, py, image);
    entity.layer = 2;
  }
  else {
    entity = new Entity(px, py, image);
  }

  entities.push(entity);
  return entity;
}

for (let y = 0; y < 21; y++) {
  for (let x = 0; x < 40; x++) {
    const tile = map1.map[y][x];
    if (tile.index > 0) {
      createEntity(tile, x, y);
    }
  }
}

entities.sort((a, b) => {
  if (a.layer > b.layer) return 1;
  if (a.layer < b.layer) return -1;
  return 0;
});

const logic: Logic = {
  tryMove: (movingEntity, x, y) => {
    movingEntity.x += x;
    movingEntity.y += y;

    let canMove = true;
    for (let i = 0; i < entities.length; i++) {
      const collidedInto = entities[i];
      if (
        movingEntity.x + 7 >= collidedInto.x &&
        movingEntity.y + 7 >= collidedInto.y &&
        movingEntity.x <= collidedInto.x + 7 &&
        movingEntity.y <= collidedInto.y + 7
      ) {
        if (collidedInto === movingEntity) continue;
        if (collidedInto.dead) continue;
        if (!movingEntity.collideWith) continue;

        const result = movingEntity.collideWith(collidedInto, x, y);
        if (result === 'stop') {
          canMove = false;
          break;
        }
      }
    }

    if (!canMove) {
      movingEntity.x -= x;
      movingEntity.y -= y;
    }

    return canMove;
  },

};

const pixelsHsla = new Uint16Array(40 * 8 * 21 * 8 * 4);

engine.update = (t) => {
  // Update entities
  for (const e of entities) {
    if (e.dead) continue;
    e.update?.(t, logic);
  }

  // Draw entities
  for (const e of entities) {
    if (e.dead) continue;

    for (let y = 0; y < 8; y++) {
      const yy = e.ry + y;

      for (let x = 0; x < 8; x++) {
        const xx = e.rx + x;

        const i = y * 8 * 4 + x * 4;
        const h = e.image.pixels[i + 0];
        const s = e.image.pixels[i + 1];
        const l = e.image.pixels[i + 2];
        const a = e.image.pixels[i + 3];

        if (a > 0) {
          const p = (yy * 40 * 8 * 4) + (xx * 4);
          pixelsHsla[p + 0] = h;
          pixelsHsla[p + 1] = s;
          pixelsHsla[p + 2] = l;
          pixelsHsla[p + 3] = a;
        }
      }
    }
  }

  // // Light around players
  // const D = 30;
  // for (let y = 0; y < 21 * 8; y++) {
  //   for (let x = 0; x < 40 * 8; x++) {
  //     const ii = (y * 40 * 8 * 4) + (x * 4);

  //     let brightness = 0;

  //     let i = players.length;
  //     while (i--) {
  //       const dx = (players[i].x + 4) - x;
  //       const dy = (players[i].y + 4) - y;
  //       const d = Math.sqrt(dx ** 2 + dy ** 2);
  //       if (d < D) {
  //         // if (d % 2 > 0.5) {
  //         const perc = (D - d + (D / 2)) / D;
  //         brightness += (1 * perc);
  //         // }
  //       }
  //     }

  //     pixelsHsla[ii + 3] = (brightness / 1) * 155 + 100;
  //   }
  // }

  // // Scanlines
  // for (let y = 0; y < 21 * 8; y += 2) {
  //   for (let x = 0; x < 40 * 8; x++) {
  //     const p = (y * 40 * 8 * 4) + (x * 4);
  //     pixelsHsla[p + 0] = (pixelsHsla[p + 0] + 10) % 360;
  //     // pixelsHsla[p + 1] = Math.max(0, pixelsHsla[p + 1] - 20);
  //     // pixelsHsla[p + 2] = Math.max(0, pixelsHsla[p + 2] - 20);
  //     pixelsHsla[p + 3] = Math.max(0, pixelsHsla[p + 3] - 20);
  //   }
  // }

  // Apply drawing to screen
  for (let p = 0; p < 21 * 8 * 40 * 8 * 4; p += 4) {
    const h = pixelsHsla[p + 0];
    const s = pixelsHsla[p + 1];
    const l = pixelsHsla[p + 2];
    const a = pixelsHsla[p + 3];
    const [r, g, b] = colorConvert.hsl.rgb([h, s, l]);
    screen.pixels[p + 0] = r;
    screen.pixels[p + 1] = g;
    screen.pixels[p + 2] = b;
    screen.pixels[p + 3] = a;
  }

  screen.blit();
};
