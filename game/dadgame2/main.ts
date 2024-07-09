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

const game1 = await loadCleanP8('game/dadgame2/explore.p8');

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
}

for (let y = 0; y < 22; y++) {
  for (let x = 0; x < 40; x++) {
    const tile = game1.map[y][x];
    if (tile.index > 0) {
      createEntity(tile, x, y);
    }
  }
}

drawables.sort((a, b) => {
  if (a.layer > b.layer) return 1;
  if (a.layer < b.layer) return -1;
  return 0;
});

// let mx = 0;
// let my = 0;

// ctx.canvas.onmousemove = (e) => {
//   mx = Math.round(e.offsetX / SCALE);
//   my = Math.round(e.offsetY / SCALE);
// };

engine.update = (t) => {
  for (const e of updatables) {
    e.update(t);
  }

  ctx.reset();

  // ctx.strokeStyle = '#fff';

  // for (let i = 0; i < players.length; i++) {
  //   const player = players[i];
  //   const x = (PANELW + 1) * i;

  // ctx.save();

  // ctx.beginPath();
  // ctx.moveTo(x, 0);
  // ctx.lineTo(x + PANELW, 0);
  // ctx.lineTo(x + PANELW, HEIGHT);
  // ctx.lineTo(x, HEIGHT);
  // ctx.clip();

  // ctx.translate(x, 0);

  // ctx.fillStyle = '#000024';
  // ctx.fillRect(0, 0, PANELW, HEIGHT);

  // ctx.translate(player.camera.mx, player.camera.my);
  for (const e of drawables) {
    let near = false;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.entity.near(e)) {
        near = true;
        break;
      }
    }

    if (!near) {
      ctx.save();
      ctx.globalAlpha = 0.25;
    }
    e.draw(ctx);
    if (!near) {
      ctx.restore();
    }
  }

  // ctx.restore();
  // }

  // const dx = Math.floor(mx / 8) * 8;
  // const dy = Math.floor(my / 8) * 8;

  // ctx.fillStyle = '#f007';
  // ctx.fillRect(dx, dy, 8, 8);
  // ctx.fillRect(dx + .5, dy + .5, 7, 7);
  // ctx.beginPath();
  // ctx.rect(dx + .5, dy + .5, 7, 7);
  // ctx.stroke();
};
