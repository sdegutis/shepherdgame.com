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
