export const A = 0, B = 1, X = 2, Y = 3;
export const L = 4, R = 5, ZL = 6, ZR = 7;
export const MINUS = 8, PLUS = 9;
export const LTRIGGER = 10, RTRIGGER = 11;
export const UP = 12, DOWN = 13, LEFT = 14, RIGHT = 15;
export const HOME = 16;

type Engine = { update: (t: number) => void };

export function runGameLoop() {
  const engine: Engine = { update: () => { } };
  const framerate = 30;
  let from = +document.timeline.currentTime!;
  const step = () => {
    requestAnimationFrame(t => {
      if (t - from >= framerate) {
        engine.update(t);
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
  canvas.style.width = (width * scale) + 'px';
  canvas.style.height = (height * scale) + 'px';
  canvas.width = width;
  canvas.height = height;
  document.body.append(canvas);
  return canvas.getContext('2d')!;
}
