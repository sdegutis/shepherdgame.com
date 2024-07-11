import { Bubble } from "./entities/bubble.js";
import { BubbleWand } from "./entities/bubblewand.js";
import { Entity, Logic } from "./entities/entity.js";
import { Marker } from "./entities/marker.js";
import { Player } from "./entities/player.js";
import { Wall } from "./entities/wall.js";
import { createCanvas, runGameLoop } from "./lib/core.js";
import { loadCleanP8, MapTile } from "./lib/pico8.js";

const WIDTH = 320;
const HEIGHT = 180;

const ctx = createCanvas(WIDTH, HEIGHT, 5);
const engine = runGameLoop();

const game1 = await loadCleanP8('game/dadgame2/explore.p8');

const entities: Entity[] = [];

const players: Player[] = [];
let playerIndex = 0;

function createEntity(tile: MapTile, x: number, y: number) {
  const px = x * 8;
  const py = y * 8;
  const image = tile.sprite.image;

  let entity;

  if (tile.index >= 1 && tile.index <= 3) {
    const bubble = new Bubble(0, 0, game1.sprites[5].image, game1.sprites[21].image);
    bubble.layer = 1;
    entities.push(bubble);

    entity = new Player(px, py, image, playerIndex++, bubble);
    entity.layer = 2;
    players.push(entity);
  }
  else if (tile.sprite.flags.RED) {
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
  else if (tile.index === 20) {
    entity = new Marker(px, py, image);
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
    const tile = game1.map[y][x];
    if (tile.index > 0) {
      createEntity(tile, x, y);
    }
  }
}

for (let y = 0; y < 21; y++) {
  for (let x = 0; x < 40; x++) {
    const tile = game1.map[y + 21][x];
    if (tile.index > 0) {
      createEntity(tile, x, y).layer = 3;
    }
  }
}

for (let y = 0; y < 21; y++) {
  for (let x = 0; x < 40; x++) {
    const tile = game1.map[y + 42][x];
    if (tile.index > 0) {
      createEntity(tile, x, y).layer = -3;
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

  create: (x, y) => {
    createEntity(game1.map[0][0], x, y);
    // const entity = new Entity(x, y, game1.ma);
    // entities.push(entity);
  },

};

const pixels = new Uint8ClampedArray(40 * 8 * 21 * 8 * 4);
const imgdata = new ImageData(pixels, 40 * 8, 21 * 8);

engine.update = (t) => {
  for (const e of entities) {
    if (e.dead) continue;
    e.update?.(t, logic);
  }

  for (const e of entities) {
    if (e.dead) continue;
    e.draw(pixels);
  }

  for (let y = 0; y < 21 * 8; y++) {
    for (let x = 0; x < 40 * 8; x++) {
      const p = (y * 40 * 8 * 4) + (x * 4);
      // pixels[p + 0] = 0;
      // pixels[p + 1] = 0;
      // pixels[p + 2] = 0;
      // pixels[p + 3] = 0;

      let near = false;
      for (const p of players) {
        const dx = (p.x + 4) - x;
        const dy = (p.y + 4) - y;
        const d = Math.sqrt(dx ** 2 + dy ** 2);
        if (d < 20) {
          near = true;
          break;
        }
      }
      if (!near) {
        pixels[p + 3] = 100;
      }
    }
  }

  for (let y = 0; y < 21 * 8; y += 2) {
    for (let x = 0; x < 40 * 8; x++) {
      const p = (y * 40 * 8 * 4) + (x * 4);
      pixels[p + 3] -= 30;
    }
  }

  ctx.putImageData(imgdata, 0, 0);
};
