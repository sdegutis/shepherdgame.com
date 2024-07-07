import { Door } from "./entities/door.js";
import { Entity } from "./entities/entity.js";
import { Key } from "./entities/key.js";
import { Player } from "./entities/player.js";
import { Wall } from "./entities/wall.js";
import { Camera } from "./lib/camera.js";
import { createCanvas, runGameLoop } from "./lib/core.js";
import { actables, drawables, players, updatables } from "./lib/data.js";
import { loadCleanP8, MapTile } from "./lib/pico8.js";

const WIDTH = 320;
const HEIGHT = 180;

const PANELW = (WIDTH - 2) / 3;

const ctx = createCanvas(WIDTH, HEIGHT, 5);
const engine = runGameLoop();

const game1 = await loadCleanP8('game/dadgame1/explore.p8');

const MW = game1.map[0].length * 8;
const MH = game1.map.length * 8;

const BOMB = game1.sprites[6];
const OPENDOOR = game1.sprites[4];

function createEntity(tile: MapTile, x: number, y: number) {
  const entity = new Entity(x * 8, y * 8, tile.sprite.image);
  drawables.push(entity);

  if (tile.index >= 1 && tile.index <= 3) {
    const player = new Player(entity, BOMB);

    player.camera = new Camera(MW, MH, PANELW, HEIGHT, player);
    player.camera.update();

    entity.layer = 2;
    players.push(player);
    updatables.push(player);
  }
  else if ([18].includes(tile.index)) {
    const wall = new Wall(entity);
    actables.push(wall);
  }
  else if (tile.index === 21) {
    const key = new Key(entity);
    entity.layer = 1;
    actables.push(key);
    updatables.push(key);
  }
  // else if (tile.index === 6) {
  //   const bomb = new Bomb(entity);
  //   entity.layer = 1;
  //   actables.push(bomb);
  //   updatables.push(bomb);
  // }
  // else if (tile.index === 10) {
  //   const bar = new Bar(entity);
  //   actables.push(bar);
  // }
  // else if (tile.index === 5) {
  //   const button = new Button(entity);
  //   entity.layer = 1;
  //   actables.push(button);
  // }
  else if (tile.index === 20) {
    const door = new Door(entity, OPENDOOR);
    entity.layer = 1;
    actables.push(door);
  }
  // else if (tile.index === 9) {
  //   const crack = new Crack(entity);
  //   entity.layer = 1;
  //   actables.push(crack);
  // }
}

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
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

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const x = (PANELW + 1) * i;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + PANELW, 0);
    ctx.lineTo(x + PANELW, HEIGHT);
    ctx.lineTo(x, HEIGHT);
    ctx.clip();

    ctx.translate(x, 0);

    ctx.fillStyle = '#000024';
    ctx.fillRect(0, 0, PANELW, HEIGHT);

    ctx.translate(player.camera.mx, player.camera.my);
    for (const e of drawables) {
      e.draw(ctx);
    }

    ctx.restore();
  }

  // const dx = Math.floor(mx / 8) * 8;
  // const dy = Math.floor(my / 8) * 8;

  // ctx.fillStyle = '#f007';
  // ctx.fillRect(dx, dy, 8, 8);
  // ctx.fillRect(dx + .5, dy + .5, 7, 7);
  // ctx.beginPath();
  // ctx.rect(dx + .5, dy + .5, 7, 7);
  // ctx.stroke();
};
