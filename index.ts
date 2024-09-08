// index.ts
import { Keyboard } from './keyboard';
import { ScaleType, Direction, Note } from './types';

const keyboard = new Keyboard();

async function playAndLogScale(startNote: string, scaleType: ScaleType, direction: Direction, rhythm?: number[], dynamics?: number[]) {
  console.log(`Playing ${scaleType} scale starting from ${startNote} ${direction}...`);
  const scale = keyboard.getScale(startNote, scaleType, direction);
  console.log(`Notes: ${scale.map(note => note.pitch).join(', ')}`);

  if (rhythm || dynamics) {
    scale.forEach((note, index) => {
      if (rhythm) note.duration = rhythm[index % rhythm.length];
      if (dynamics) note.velocity = dynamics[index % dynamics.length];
    });
  }

  await keyboard.playSequence(scale);
}

async function main() {
  const startNotes = ['C4', 'G4', 'F#4', 'Bb4'];
  const scaleTypes = [ScaleType.Blues, ScaleType.PentatonicMajor, ScaleType.PentatonicMinor];
  
  // Example rhythm and dynamics patterns
  const swingRhythm = [0.3, 0.2, 0.3, 0.2];
  const crescendo = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  for (const startNote of startNotes) {
    for (const scaleType of scaleTypes) {
      await playAndLogScale(startNote, scaleType, Direction.Ascending, swingRhythm, crescendo);
      await playAndLogScale(startNote, scaleType, Direction.Descending);
    }
  }
}

main().catch(console.error);