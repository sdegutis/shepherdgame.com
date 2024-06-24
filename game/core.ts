import { loadP8 } from "./pico8.js";

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
