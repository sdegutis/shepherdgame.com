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

// interface Actable {
//   actOn(player: Player): boolean;
// }

const entities: Entity[] = [];
const players: Player[] = [];
// const actables: Actable[] = [];

const walls: Entity[] = [];
const keys: Key[] = [];
const doors: Entity[] = [];

const MW = game1.map[0].length * 8;
const MH = game1.map.length * 8;

const camera = new Camera(MW, MH, WIDTH, HEIGHT, players);

class Entity {

  layer = 0;
  ox = 0; oy = 0;
  w = 8; h = 8;

  constructor(
    public x: number,
    public y: number,
    public image: OffscreenCanvas,
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    ctx.drawImage(this.image, x - this.ox, y - this.oy);

    // ctx.strokeStyle = '#f00a';
    // ctx.lineWidth = 1;
    // ctx.beginPath();
    // ctx.rect(x + 0.5, y + 0.5, this.box.w - 1, this.box.h - 1);
    // ctx.stroke();
  }

  intersects(other: Entity, x: number, y: number) {
    return (
      x + this.w >= other.x &&
      y + this.h >= other.y &&
      x < other.x + other.w &&
      y < other.y + other.h
    );
  }

}

class Player {

  gamepadIndex = gamepadIndexes.shift()!;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]; }

  keys = 0;

  constructor(public entity: Entity) {
    entity.ox = 2;
    entity.oy = 1;
    entity.w = 4;
    entity.h = 7;
  }

  update() {
    if (!this.gamepad) return;
    const [x1, y1] = this.gamepad.axes;

    const speed = 1;

    const x = this.entity.x + x1 * speed;



    if (walls.some(wall => this.entity.intersects(wall, x, this.entity.y))) {
      this.rumble(.01, .3, 0);
    }
    else {
      this.entity.x = x;
      camera.update();
    }

    const y = this.entity.y + y1 * speed;
    if (walls.some(wall => this.entity.intersects(wall, this.entity.x, y))) {
      this.rumble(.01, .3, 0);
    }
    else {
      this.entity.y = y;
      camera.update();
    }

    const key = keys.find(key => this.entity.intersects(
      key.entity,
      this.entity.x,
      this.entity.y
    ));

    if (key) {
      this.keys++;

      const keyIndex = keys.indexOf(key);
      keys.splice(keyIndex, 1);

      const eIndex = entities.indexOf(key.entity);
      entities.splice(eIndex, 1);

      this.rumble(.3, 1, 1);
    }

    const door = doors.find(door => this.entity.intersects(
      door,
      this.entity.x,
      this.entity.y
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
    this.x = entity.x;
    this.y = entity.y;
  }

  update(t: number) {
    const durationMs = 1000;
    const percent = (t % durationMs) / durationMs;
    const percentOfCircle = percent * Math.PI * 2;
    const distance = 1.5;
    this.entity.y = this.y + +Math.cos(percentOfCircle) * distance;
    this.entity.x = this.x + -Math.sin(percentOfCircle) * distance;
  }

}

function createEntity(spr: Sprite, x: number, y: number) {
  const entity = new Entity(x * 8, y * 8, spr.image);
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
