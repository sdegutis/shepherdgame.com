import { createCanvas, getPlayers, runGameLoop } from "./core.js";
import { loadCleanP8 } from "./pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars


const ctx = createCanvas(1880, 900, 4);
const engine = runGameLoop();
await getPlayers(engine, ctx);


const game1 = await loadCleanP8('game/explore.p8');

// let mx = 0;
// let my = 0;

class Player {

  image;

  constructor(
    private gamepadIndex: number,
    public x: number,
    public y: number,
    playerNum: number,
  ) {
    this.image = game1.sprites[playerNum + 1].image;
  }

  get gamepad() { return navigator.getGamepads()[this.gamepadIndex]! }

  update() {
    const [x1, y1] = this.gamepad.axes;
    this.x += x1;
    this.y += y1;
  }

}

interface Entity {
  image: OffscreenCanvas;
  x: number;
  y: number;
}

const entities: Entity[] = [];

const players = (navigator.getGamepads()
  .filter(gp => gp !== null)
  .map((gp, i) => new Player(gp.index, 0, 0, i))
);

for (let y = 0; y < 64; y++) {
  for (let x = 0; x < 128; x++) {
    const tile = game1.map[y][x];
    entities.push({
      image: tile.sprite.image,
      x: x * 8,
      y: y * 8,
    });
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

  for (const e of entities) {
    ctx.drawImage(e.image, e.x, e.y);
  }

  for (const p of players) {
    ctx.drawImage(p.image, Math.round(p.x), Math.round(p.y));
  }

};
