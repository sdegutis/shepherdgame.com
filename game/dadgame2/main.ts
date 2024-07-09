import { BubbleWand } from "./entities/bubblewand.js";
import { Entity } from "./entities/entity.js";
import { Player } from "./entities/player.js";
import { Wall } from "./entities/wall.js";
import { createCanvas, runGameLoop } from "./lib/core.js";
import { actables, drawables, players, updatables } from "./lib/data.js";
import { loadCleanP8, MapTile } from "./lib/pico8.js";

const WIDTH = 320;
const HEIGHT = 180;

const ctx = createCanvas(WIDTH, HEIGHT, 5);
const engine = runGameLoop();

export const game1 = await loadCleanP8('game/dadgame2/explore.p8');

function createEntity(tile: MapTile, x: number, y: number) {
  const entity = new Entity(x * 8, y * 8, tile.sprite.image);
  drawables.push(entity);

  if (tile.index >= 1 && tile.index <= 3) {
    const player = new Player(entity);

    entity.layer = 2;
    players.push(player);
    updatables.push(player);
  }
  else if (tile.sprite.flags.RED) {
    const wall = new Wall(entity);
    actables.push(wall);
  }
  else if (tile.sprite.flags.ORANGE) {
    const wall = new Wall(entity, true);
    actables.push(wall);
  }
  else if (tile.index === 4) {
    const wand = new BubbleWand(entity);
    entity.layer = 2;
    actables.push(wand);
    updatables.push(wand);
  }

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

drawables.sort((a, b) => {
  if (a.layer > b.layer) return 1;
  if (a.layer < b.layer) return -1;
  return 0;
});

engine.update = (t) => {
  for (const e of updatables) {
    e.update(t);
  }

  ctx.reset();

  for (const e of drawables) {
    let near = false;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.entity.near(e)) {
        near = true;
        break;
      }
    }

    ctx.globalAlpha = near ? 1 : 0.25;
    e.draw(ctx);
  }
};
