import { createCanvas, getPlayers, runGameLoop, ZL, ZR } from "./core.js";
import { loadCleanP8 } from "./pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars


const ctx = createCanvas(1400, 900, 4);
const engine = runGameLoop();
await getPlayers(engine, ctx);


const game1 = await loadCleanP8('game/explore.p8');

let mx = 0;
let my = 0;

engine.update = () => {
  for (const gamepad of navigator.getGamepads()) {
    if (!gamepad) continue;

    gamepad.vibrationActuator.reset();
    if (gamepad.buttons[ZR].value || gamepad.buttons[ZL].value) {
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 500,
        weakMagnitude: gamepad.buttons[ZL].value,
        strongMagnitude: gamepad.buttons[ZR].value,
      });
    }

    mx += gamepad.axes[0];
    my += gamepad.axes[1];

    mx += gamepad.axes[2] * 3;
    my += gamepad.axes[3] * 3;
  }

  ctx.reset();
  ctx.translate(mx, my);

  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 128; x++) {
      const tile = game1.map[y][x];
      if (tile.index > 0) {
        ctx.drawImage(tile.sprite.image, x * 8, y * 8);
      }
    }
  }

};
