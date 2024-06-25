import { Camera } from "./camera.js";
import { createCanvas, getPlayers, runGameLoop } from "./core.js";
import { loadCleanP8, MapTile } from "./pico8.js";
import { playNote } from "./sfx.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars

const WIDTH = 320;
const HEIGHT = 180;
const SCALE = 5;

const ctx = createCanvas(WIDTH, HEIGHT, SCALE);
const engine = runGameLoop();
const gamepadIndexes = await getPlayers(engine, ctx);

playNote('C', 5, 2, { type: 'triangle' });

const game1 = await loadCleanP8('game/explore.p8');

const entities: Entity[] = [];
const players: Player[] = [];
const walls: Entity[] = [];
const keys: Key[] = [];

const MW = game1.map[0].length * 8;
const MH = game1.map.length * 8;

const camera = new Camera(MW, MH, WIDTH, HEIGHT, players);

class Box {

  w = 8; h = 8;
  constructor(public x: number, public y: number) { }

  intersects(other: Box, x: number, y: number) {
    return (
      x + this.w >= other.x &&
      y + this.h >= other.y &&
      x < other.x + other.w &&
      y < other.y + other.h
    );
  }

}

class Entity {

  layer = 0;
  ox = 0; oy = 0;

  constructor(
    public box: Box,
    public image: OffscreenCanvas,
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    const x = Math.round(this.box.x);
    const y = Math.round(this.box.y);
    ctx.drawImage(this.image, x - this.ox, y - this.oy);

    // ctx.strokeStyle = '#f00a';
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.rect(x + 0.5, y + 0.5, this.box.w - 1, this.box.h - 1);
    // ctx.stroke();
  }

}

class Player {

  gamepadIndex = gamepadIndexes.shift()!;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  constructor(public entity: Entity) {
    entity.ox = 2;
    entity.oy = 1;
    entity.box.w = 4;
    entity.box.h = 7;
  }

  update() {
    if (!this.gamepad) return;
    const [x1, y1] = this.gamepad.axes;

    const speed = 1;

    const x = this.entity.box.x + x1 * speed;
    if (!this.hitWall(x, this.entity.box.y)) {
      this.entity.box.x = x;
      camera.update();
    }

    const y = this.entity.box.y + y1 * speed;
    if (!this.hitWall(this.entity.box.x, y)) {
      this.entity.box.y = y;
      camera.update();
    }

    const key = this.hitKey(this.entity.box.x, this.entity.box.y);
    if (key) {
      playNote('F', 3, 1, { type: 'square' });

      const keyIndex = keys.indexOf(key);
      keys.splice(keyIndex, 1);

      const eIndex = entities.indexOf(key.entity);
      entities.splice(eIndex, 1);

      this.gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 300,
        duration: 100,
        weakMagnitude: 1,
        strongMagnitude: 1,
      });
    }
  }

  hitWall(x: number, y: number) {
    for (const wall of walls) {
      if (this.entity.box.intersects(wall.box, x, y)) {
        return true;
      }
    }
    return false;
  }

  hitKey(x: number, y: number) {
    for (const key of keys) {
      if (this.entity.box.intersects(key.entity.box, x, y)) {
        return key;
      }
    }
    return null;
  }

}

class Key {

  x; y;

  constructor(public entity: Entity) {
    this.x = entity.box.x;
    this.y = entity.box.y;
  }

  update(t: number) {
    const durationMs = 1000;
    const percent = (t % durationMs) / durationMs;
    const percentOfCircle = percent * Math.PI * 2;
    const distance = 1.5;
    this.entity.box.y = this.y + +Math.cos(percentOfCircle) * distance;
    this.entity.box.x = this.x + -Math.sin(percentOfCircle) * distance;
  }

}

function createEntity(tile: MapTile, x: number, y: number) {
  const box = new Box(x * 8, y * 8);

  const entity = new Entity(box, tile.sprite.image);
  entities.push(entity);

  if (tile.sprite.flags.GREEN) {
    const player = new Player(entity);
    entity.layer = 2;
    players.push(player);
    createEntity(game1.map[y][x - 1], x, y);
  }
  else if (tile.sprite.flags.RED) {
    walls.push(entity);
  }
  else if (tile.sprite.flags.YELLOW) {
    const key = new Key(entity);
    entity.layer = 1;
    keys.push(key);
    createEntity(game1.map[y][x - 1], x, y);
  }
}

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
    createEntity(game1.map[y][x], x, y);
  }
}

entities.sort((a, b) => {
  if (a.layer > b.layer) return 1;
  if (a.layer < b.layer) return -1;
  return 0;
});

camera.update();

engine.update = (t) => {
  for (const player of players) {
    player.update();
  }

  for (const key of keys) {
    key.update(t);
  }

  ctx.reset();
  ctx.translate(camera.mx, camera.my);

  for (const e of entities) {
    e.draw(ctx);
  }
};
