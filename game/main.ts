import { Door } from "./entities/door.js";
import { Entity } from "./entities/entity.js";
import { Key } from "./entities/key.js";
import { Player } from "./entities/player.js";
import { Wall } from "./entities/wall.js";
import { Camera } from "./lib/camera.js";
import { createCanvas, runGameLoop } from "./lib/core.js";
import { actables, drawables, players, updatables } from "./lib/data.js";
import { loadCleanP8, MapTile } from "./lib/pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars

const WIDTH = 320;
const HEIGHT = 180;
const SCALE = 5;

const ctx = createCanvas(WIDTH, HEIGHT, SCALE);
const engine = runGameLoop();

const game1 = await loadCleanP8('sarah/untitled_2.p8');

const MW = game1.map[0].length * 8;
const MH = game1.map.length * 8;

const camera = new Camera(MW, MH, WIDTH, HEIGHT, players);

function createEntity(tile: MapTile, x: number, y: number) {
  const entity = new Entity(x * 8, y * 8, tile.sprite.image);
  drawables.push(entity);

  if (tile.index >= 1 && tile.index <= 3) {
    const player = new Player(entity, camera);
    entity.layer = 2;
    players.push(player);
    updatables.push(player);
  }
  else if ([8].includes(tile.index)) {
    const wall = new Wall(entity);
    actables.push(wall);
  }
  else if (tile.index === 4) {
    const key = new Key(entity);
    entity.layer = 1;
    actables.push(key);
    updatables.push(key);
  }
  else if (tile.index === 11) {
    const door = new Door(entity);
    entity.layer = 1;
    actables.push(door);
  }
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

camera.update();

engine.update = (t) => {
  for (const e of updatables) {
    e.update(t);
  }

  ctx.reset();
  ctx.translate(camera.mx, camera.my);

  for (const e of drawables) {
    e.draw(ctx);
  }
};
