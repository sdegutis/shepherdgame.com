import { createCanvas, getPlayers, runGameLoop } from "./core.js";
import { loadP8 } from "./pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars


const ctx = createCanvas(1400, 900, 4);
const engine = runGameLoop();
await getPlayers(engine, ctx);


const game1 = await loadP8('game/explore.p8');

let mx = 0;
let my = 0;

draw();

enum B {
  A, B, X, Y,
  L, R, ZL, ZR,
  MINUS, PLUS,
  LTRIGGER, RTRIGGER,
  UP, DOWN, LEFT, RIGHT,
  HOME,
}

engine.update = () => {
  for (const gamepad of navigator.getGamepads()) {
    if (!gamepad) continue;

    gamepad.vibrationActuator.reset();
    if (gamepad.buttons[B.ZR]!.value || gamepad.buttons[B.ZL]!.value) {
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 500,
        weakMagnitude: gamepad.buttons[B.ZL]!.value,
        strongMagnitude: gamepad.buttons[B.ZR]!.value,
      });
    }


    const [x1, y1, x2, y2] = gamepad.axes as [number, number, number, number];

    mx += x1;
    my += y1;

    mx += x2 * 3;
    my += y2 * 3;

    draw();
  }


};


function draw() {
  ctx.reset();

  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 128; x++) {
      const spr = game1.map[y]![x]!;
      if (spr > 0) {
        const img = game1.sprites[spr]!;
        ctx.putImageData(img, mx + x * 8, my + y * 8);
      }
    }
  }
}
