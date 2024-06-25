const audio = new AudioContext();

function freqFromA4(n: number) {
  return 2 ** (n / 12) * 440;
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

function freqForNote(note: typeof notes[number], oct: number) {
  const index = notes.indexOf(note) + (12 * oct);
  return freqFromA4(-57 + index);
}

export function playNote(note: typeof notes[number], octave: number, duration: number, options?: {
  type?: OscillatorType,
  vol?: number,
}) {
  const g = audio.createGain();
  if (options?.vol !== undefined) g.gain.value = options.vol;
  g.connect(audio.destination);

  g.gain.exponentialRampToValueAtTime(0.00001, audio.currentTime + duration)

  const o = audio.createOscillator();
  o.connect(g);

  if (options?.type !== undefined) o.type = options?.type;
  o.frequency.value = freqForNote(note, octave);
  o.start();
}
