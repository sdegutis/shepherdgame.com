import { BubbleWand } from "./entities/bubblewand.js";
import { Entity } from "./entities/entity.js";
import { Player } from "./entities/player.js";
import { Wall } from "./entities/wall.js";
import { createCanvas, runGameLoop } from "./lib/core.js";
import { entities, players } from "./lib/data.js";
import { loadCleanP8, MapTile } from "./lib/pico8.js";

const WIDTH = 320;
const HEIGHT = 180;

const ctx = createCanvas(WIDTH, HEIGHT, 5);
const engine = runGameLoop();

export const game1 = await loadCleanP8('game/dadgame2/explore.p8');

function createEntity(tile: MapTile, x: number, y: number) {
  const px = x * 8;
  const py = y * 8;
  const image = tile.sprite.image;

  let entity;

  if (tile.index >= 1 && tile.index <= 3) {
    entity = new Player(px, py, image);
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

engine.update = (t) => {
  for (const e of entities) {
    e.update?.(t);
  }

  ctx.reset();

  for (const e of entities) {
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
