import { Camera } from "./camera.js";
import { createCanvas, getPlayers, runGameLoop } from "./core.js";
import { loadCleanP8, MapTile } from "./pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars

const WIDTH = 750;
const HEIGHT = 450;
const SCALE = 2;

const ctx = createCanvas(WIDTH, HEIGHT, SCALE);
const engine = runGameLoop();
const gamepadIndexes = await getPlayers(engine, ctx);

const game1 = await loadCleanP8('game/explore.p8');

const entities: Entity[] = [];
const players: Player[] = [];
const walls: Entity[] = [];

const MW = game1.map[0].length * 8;
const MH = game1.map.length * 8;

const camera = new Camera(MW, MH, WIDTH, HEIGHT, players);

class Entity {

  layer = 0;

  constructor(
    public x: number,
    public y: number,
    public image: OffscreenCanvas,
  ) { }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, Math.round(this.x), Math.round(this.y));
  }

}

class Player {

  gamepadIndex = gamepadIndexes.shift()!;
  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]!; }

  constructor(public entity: Entity) { }

  update() {
    const [x1, y1] = this.gamepad.axes;

    const x = this.entity.x + x1;
    const y = this.entity.y + y1;

    if (!this.hitWall(x, y)) {
      this.entity.x = x;
      this.entity.y = y;
      camera.update();
    }
  }

  hitWall(x: number, y: number) {
    for (const wall of walls) {
      if (
        x + 8 >= wall.x &&
        y + 8 >= wall.y &&
        x < wall.x + 8 &&
        y < wall.y + 8
      ) return true;
    }
    return false;
  }

  // gamepad.vibrationActuator.reset();
  // if (gamepad.buttons[ZR].value || gamepad.buttons[ZL].value) {
  //   gamepad.vibrationActuator.playEffect("dual-rumble", {
  //     startDelay: 0,
  //     duration: 500,
  //     weakMagnitude: gamepad.buttons[ZL].value,
  //     strongMagnitude: gamepad.buttons[ZR].value,
  //   });
  // }

}

function createEntity(tile: MapTile, x: number, y: number) {
  const entity = new Entity(x * 8, y * 8, tile.sprite.image);
  entities.push(entity);

  if (tile.sprite.flags.GREEN) {
    createEntity(game1.map[y][x - 1], x, y);

    const player = new Player(entity);
    entity.layer = 1;
    players.push(player);
  }
  else if (tile.sprite.flags.RED) {
    walls.push(entity);
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

engine.update = () => {
  for (const player of players) {
    player.update();
  }

  ctx.reset();
  ctx.translate(camera.mx, camera.my);

  for (const e of entities) {
    e.draw(ctx);
  }
};
