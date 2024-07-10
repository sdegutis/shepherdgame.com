import { Bubble } from "./entities/bubble.js";
import { BubbleWand } from "./entities/bubblewand.js";
import { Entity, Logic } from "./entities/entity.js";
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

function intersects(a: Entity, b: Entity) {
  return (
    a.x + 7 >= b.x &&
    a.y + 7 >= b.y &&
    a.x <= b.x + 7 &&
    a.y <= b.y + 7
  );
}

const logic: Logic = {
  tryMove: (movingEntity, x, y) => {
    movingEntity.x += x;
    movingEntity.y += y;

    const touching = entities.filter(a => intersects(a, movingEntity));
    const canMove = touching.every(collidedInto => {
      if (collidedInto === movingEntity) return true;
      if (collidedInto.dead) return true;
      if (!movingEntity.collideWith) return true;

      const result = movingEntity.collideWith(collidedInto, x, y);
      return result === 'pass';
    });

    if (!canMove) {
      movingEntity.x -= x;
      movingEntity.y -= y;
    }

    return canMove;
  },
};

engine.update = (t) => {
  for (const e of entities) {
    if (e.dead) continue;

    e.update?.(t, logic);
  }

  ctx.reset();

  for (const e of entities) {
    if (e.dead) continue;

    let near = false;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.near(e)) {
        near = true;
        break;
      }
    }

    ctx.globalAlpha = near ? 1 : 0.25;
    e.draw(ctx);
  }
};
