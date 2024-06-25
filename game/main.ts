import { createCanvas, getPlayers, runGameLoop } from "./core.js";
import { loadCleanP8 } from "./pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars

const WIDTH = 1500;
const HEIGHT = 900;

const ctx = createCanvas(WIDTH, HEIGHT, 4);
const engine = runGameLoop();
const playerIndexes = await getPlayers(engine, ctx);


const game1 = await loadCleanP8('game/explore.p8');

class Drawable {

  constructor(
    public x: number,
    public y: number,
    public image: OffscreenCanvas,
  ) { }

}

class Player extends Drawable {

  gamepadIndex;

  constructor(
    x: number,
    y: number,
    image: OffscreenCanvas,
  ) {
    super(x, y, image);
    this.gamepadIndex = playerIndexes.shift()!;
    console.log(this.gamepadIndex)
  }

  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]! }

  update() {
    const [x1, y1] = this.gamepad.axes;
    this.x += x1;
    this.y += y1;
  }

}

interface Drawable {
  image: OffscreenCanvas;
  x: number;
  y: number;
}

const drawables: Drawable[] = [];
const players: Player[] = [];

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
    const tile = game1.map[y][x];

    const image = tile.sprite.image;
    const px = x * 8;
    const py = y * 8;

    if (tile.index >= 1 && tile.index <= 3) {
      const entity = new Player(px, py, image);
      players.push(entity);
    }
    else {
      const entity = new Drawable(px, py, image);
      drawables.push(entity);
    }
  }
}


engine.update = () => {
  for (const player of players) {
    player.update();

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

  ctx.reset();
  // ctx.translate(Math.round(mx), Math.round(my));

  for (const d of drawables) {
    ctx.drawImage(d.image, d.x, d.y);
  }

  for (const p of players) {
    ctx.drawImage(p.image, Math.round(p.x), Math.round(p.y));
  }

};
