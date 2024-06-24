import { createCanvas, runGameLoop } from "./core.js";
import { loadP8 } from "./pico8.js";

// sarahs idea:
//   i can place bombs that blow up certain bricks
//   jane can pick up keys that open doors
//   and sarah can push buttons that open bars


const ctx = createCanvas(1400, 900, 4);
const engine = runGameLoop();
await getPlayers();


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
  const players = navigator.getGamepads();
  for (const player of players) {
    if (!player) continue;

    player.vibrationActuator!.reset();
    if (player.buttons[B.ZR]!.value || player.buttons[B.ZL]!.value) {
      player.vibrationActuator!.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 500,
        weakMagnitude: player.buttons[B.ZL]!.value,
        strongMagnitude: player.buttons[B.ZR]!.value,
      });
    }


    const [x1, y1, x2, y2] = player.axes as [number, number, number, number];

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

function getPlayers() {
  return new Promise<void>(async resolve => {
    const core = await loadP8('game/core.p8');

    engine.update = () => {
      const gamepads = navigator.getGamepads();

      ctx.reset();

      for (let i = 0; i < 4; i++) {
        const gamepad = gamepads[i];

        const x = i * 30 + 120
        const w = 4;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.fillStyle = gamepad ? '#9f9' : '#f77';
        ctx.fillRect(x - w, 100 - w, 8 + (w * 2), 8 + (w * 2));

        const spr = core.sprites[1]!;
        ctx.putImageData(spr, x, 100);

        if (gamepad?.buttons[9]?.pressed) {
          resolve();
        }
      }
    }
  });
}
