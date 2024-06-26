import { Camera } from "./camera.js";
import { A, createCanvas, runGameLoop } from "./core.js";
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

const game1 = await loadCleanP8('sarah/untitled_2.p8');

interface Actable {
  actOn(player: Player): boolean;
  entity: Entity;
}

interface Updatable {
  update(t: number): void;
}

const drawables: Entity[] = [];
const players: Player[] = [];
const actables: Actable[] = [];
const updatables: Updatable[] = [];

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
    // ctx.rect(x + 0.5, y + 0.5, this.w - 1, this.h - 1);
    // ctx.stroke();
  }

}

function removeFrom<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  array.splice(index, 1);
}

function intersects(a: Entity, b: Entity) {
  return (
    a.x + a.w >= b.x &&
    a.y + a.h >= b.y &&
    a.x < b.x + b.w &&
    a.y < b.y + b.h
  );
}

class Player implements Updatable {

  gamepadIndex = players.length;
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

    const speed = this.gamepad.buttons[A].pressed ? 3 : 1;

    const xAdd = x1 * speed;
    const yAdd = y1 * speed;

    let found;

    this.entity.x += xAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this)) this.entity.x -= xAdd; else camera.update();

    this.entity.y += yAdd;
    found = actables.find(a => intersects(a.entity, this.entity));
    if (found && !found.actOn(this)) this.entity.y -= yAdd; else camera.update();
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

class Key implements Updatable, Actable {

  x; y;

  constructor(public entity: Entity) {
    this.x = entity.x;
    this.y = entity.y;
  }

  actOn(player: Player) {
    player.keys++;
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    player.rumble(.3, 1, 1);
    return true;
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

class Wall implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    player.rumble(.01, .3, 0);
    return false;
  }

}

class Door implements Actable {

  constructor(public entity: Entity) { }

  actOn(player: Player): boolean {
    if (player.keys === 0) {
      player.rumble(.01, .3, 0);
      return false;
    }

    player.keys--;
    removeFrom(actables, this);
    removeFrom(drawables, this.entity);
    player.rumble(.3, 1, 1);
    return true;
  }

}

function createEntity(tile: MapTile, x: number, y: number) {
  const entity = new Entity(x * 8, y * 8, tile.sprite.image);
  drawables.push(entity);

  if (tile.index >= 1 && tile.index <= 3) {
    const player = new Player(entity);
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
