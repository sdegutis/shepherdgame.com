import { Camera } from "./camera.js";
import { createCanvas, getPlayers, runGameLoop } from "./core.js";
import { loadCleanP8, MapTile, Sprite } from "./pico8.js";

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

const game1 = await loadCleanP8('game/explore.p8');

const EMPTY = 17;

const entities: Entity[] = [];
const players: Player[] = [];
const walls: Entity[] = [];
const keys: Key[] = [];
const doors: Entity[] = [];

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

  keys = 0;

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
    if (walls.some(wall => this.entity.box.intersects(wall.box, x, this.entity.box.y))) {
      this.rumble(.01, .3, 0);
    }
    else {
      this.entity.box.x = x;
      camera.update();
    }

    const y = this.entity.box.y + y1 * speed;
    if (walls.some(wall => this.entity.box.intersects(wall.box, this.entity.box.x, y))) {
      this.rumble(.01, .3, 0);
    }
    else {
      this.entity.box.y = y;
      camera.update();
    }

    const key = keys.find(key => this.entity.box.intersects(
      key.entity.box,
      this.entity.box.x,
      this.entity.box.y
    ));

    if (key) {
      this.keys++;

      const keyIndex = keys.indexOf(key);
      keys.splice(keyIndex, 1);

      const eIndex = entities.indexOf(key.entity);
      entities.splice(eIndex, 1);

      this.rumble(.3, 1, 1);
    }

    const door = doors.find(door => this.entity.box.intersects(
      door.box,
      this.entity.box.x,
      this.entity.box.y
    ));

    if (door && this.keys > 0) {
      this.keys--;

      const doorIndex = doors.indexOf(door);
      doors.splice(doorIndex, 1);

      const eIndex = entities.indexOf(door);
      entities.splice(eIndex, 1);

      this.rumble(.3, 1, 1);
    }
  }

  rumble(sec: number, weak: number, strong: number) {
    this.gamepad!.vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: sec * 1000,
      weakMagnitude: weak,
      strongMagnitude: strong,
    });
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

function createEntity(spr: Sprite, x: number, y: number) {
  const box = new Box(x * 8, y * 8);

  const entity = new Entity(box, spr.image);
  entities.push(entity);

  if (spr.flags.GREEN) {
    const player = new Player(entity);
    entity.layer = 2;
    players.push(player);
    createEntity(game1.sprites[EMPTY], x, y);
  }
  else if (spr.flags.RED) {
    walls.push(entity);
  }
  else if (spr.flags.YELLOW) {
    const key = new Key(entity);
    entity.layer = 1;
    keys.push(key);
    createEntity(game1.sprites[EMPTY], x, y);
  }
  else if (spr.flags.ORANGE) {
    entity.layer = 1;
    doors.push(entity);
    createEntity(game1.sprites[EMPTY], x, y);
  }
}

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
    createEntity(game1.map[y][x].sprite, x, y);
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
