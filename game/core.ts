import { loadP8 } from "./pico8.js";

const ui = await loadP8('game/ui.p8');

export const A = 0, B = 1, X = 2, Y = 3;
export const L = 4, R = 5, ZL = 6, ZR = 7;
export const MINUS = 8, PLUS = 9;
export const LTRIGGER = 10, RTRIGGER = 11;
export const UP = 12, DOWN = 13, LEFT = 14, RIGHT = 15;
export const HOME = 16;

export function runGameLoop() {
  const engine = { update: () => { } };
  const framerate = 1000 / 30;
  let from = +document.timeline.currentTime!;
  const step = () => {
    requestAnimationFrame(t => {
      if (t - from >= framerate) {
        engine.update();
        from = t;
      }
      step();
    });
  };
  step();
  return engine;
}

export function createCanvas(width: number, height: number, scale: number) {
  const canvas = document.createElement('canvas');
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width / scale;
  canvas.height = height / scale;
  document.body.append(canvas);
  return canvas.getContext('2d')!;
}

export function getPlayers(engine: { update: () => void }, ctx: CanvasRenderingContext2D) {
  return new Promise<void>(async resolve => {
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

        const spr = ui.sprites[1];
        ctx.drawImage(spr, x, 100);

        if (gamepad?.buttons[9]?.pressed) {
          resolve();
        }
      }
    }
  });
}
