// index.ts

import { Keyboard } from './keyboard';
import { ChordType, Direction, ScaleType } from './types';
import { Phrase, ChordProgression, ChordPlayStyle, RhythmPattern, Tempo, TimeSignature, Score, NoteEvent } from './structures';

const keyboard = new Keyboard();

class TestSuite {
  private tests: { [key: string]: () => Promise<void> } = {};

  addTest(name: string, testFunction: () => Promise<void>) {
    this.tests[name] = testFunction;
  }

  async runTest(name: string) {
    console.log(`Running test: ${name}`);
    await this.tests[name]();
    console.log(`Test completed: ${name}\n`);
  }

  async runAll() {
    for (const testName in this.tests) {
      await this.runTest(testName);
    }
  }
}




// Helper function to create a chord progression
function createChordProgression(chords: { root: string; type: ChordType; duration: number; baseVolume: number }[], style: ChordPlayStyle, rhythm: RhythmPattern): ChordProgression {
  return new ChordProgression(chords, style, rhythm);
}
// Helper function to create a melody
function createMelody(notes: string[], durations: number[], baseVolume: number): NoteEvent[] {
  return notes.map((note, index) => new NoteEvent(note, durations[index] * 1000, baseVolume, false));
}

const testSuite = new TestSuite();

// Test for Jazz chord progression
testSuite.addTest("Jazz Chord Progression", async () => {
  const progression = new ChordProgression(
    [
      { root: 'C4', type: ChordType.MajorSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'A4', type: ChordType.MinorSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'D4', type: ChordType.MinorSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 }
    ],
    ChordPlayStyle.Broken,
    RhythmPattern.ragtime()
  );
  const phrase = new Phrase();
  phrase.addChordProgression(progression);
  console.log("Playing Jazz chord progression:");
  await keyboard.playPhrase(phrase);
});

// Test for Blues chord progression
testSuite.addTest("Blues Chord Progression", async () => {
  const progression = new ChordProgression(
    [
      { root: 'C4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'F4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'C4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'F4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
      { root: 'C4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 }
    ],
    ChordPlayStyle.Rag,
    RhythmPattern.waltz()
  );
  const phrase = new Phrase();
  phrase.addChordProgression(progression);
  console.log("Playing Blues chord progression:");
  await keyboard.playPhrase(phrase);
});

// Test for composing a short score
testSuite.addTest("Compose Short Score", async () => {
  const tempo = new Tempo(120);
  const timeSignature = new TimeSignature(4, 4);
  const score = new Score("Short Composition", "AI Composer", tempo, timeSignature, []);

  // Create an intro phrase
  const introProgression = new ChordProgression(
    [
      { root: 'C4', type: ChordType.Major, duration: 2, baseVolume: 0.7 },
      { root: 'G4', type: ChordType.Major, duration: 2, baseVolume: 0.7 }
    ],
    ChordPlayStyle.Arpeggio,
    RhythmPattern.fourFourCommon()
  );
  const introPhrase = new Phrase();
  introPhrase.addChordProgression(introProgression);
  score.addPhrase(introPhrase);

  // Create a verse phrase
  const verseProgression = new ChordProgression(
    [
      { root: 'C4', type: ChordType.Major, duration: 1, baseVolume: 0.8 },
      { root: 'A4', type: ChordType.Minor, duration: 1, baseVolume: 0.8 },
      { root: 'F4', type: ChordType.Major, duration: 1, baseVolume: 0.8 },
      { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 }
    ],
    ChordPlayStyle.Broken,
    RhythmPattern.ragtime()
  );
  const versePhrase = new Phrase();
  versePhrase.addChordProgression(verseProgression);
  score.addPhrase(versePhrase);

  // Create a chorus phrase
  const chorusProgression = new ChordProgression(
    [
      { root: 'F4', type: ChordType.Major, duration: 1, baseVolume: 0.9 },
      { root: 'G4', type: ChordType.Major, duration: 1, baseVolume: 0.9 },
      { root: 'C4', type: ChordType.Major, duration: 2, baseVolume: 0.9 }
    ],
    ChordPlayStyle.Solid,
    RhythmPattern.waltz()
  );
  const chorusPhrase = new Phrase();
  chorusPhrase.addChordProgression(chorusProgression);
  score.addPhrase(chorusPhrase);

  // Play the entire score
  console.log("Playing composed score:");
  await keyboard.playScore(score);
});

// Test for composing a more complex, melodic score
testSuite.addTest("Compose Complex Melodic Score", async () => {
  const baseTempo = new Tempo(180); // Faster tempo
  const timeSignature = new TimeSignature(4, 4);
  const score = new Score("Complex Melodic Composition", "AI Composer", baseTempo, timeSignature, []);

  // Create a motif (short, recurring musical idea)
  const motif = createMelody(['E4', 'D4', 'C4', 'D4'], [0.25, 0.25, 0.25, 0.25], 0.8);

  // Create an intro
  const introChords = createChordProgression([
    { root: 'C4', type: ChordType.Major, duration: 1, baseVolume: 0.7 },
    { root: 'G4', type: ChordType.Major, duration: 1, baseVolume: 0.7 }
  ], ChordPlayStyle.Arpeggio, RhythmPattern.fourFourCommon());
  const introMelody = createMelody(['G4', 'E4', 'G4', 'C5'], [0.5, 0.5, 0.5, 0.5], 0.9);
  const introPhrase = new Phrase();
  introPhrase.addChordProgression(introChords);
  introPhrase.addMelody(introMelody);
  score.addPhrase(introPhrase);

  // Create a verse
  const verseChords = createChordProgression([
    { root: 'C4', type: ChordType.Major, duration: 1, baseVolume: 0.6 },
    { root: 'A4', type: ChordType.Minor, duration: 1, baseVolume: 0.6 },
    { root: 'F4', type: ChordType.Major, duration: 1, baseVolume: 0.6 },
    { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.6 }
  ], ChordPlayStyle.Broken, RhythmPattern.ragtime());
  const verseMelody = createMelody(['C5', 'B4', 'A4', 'G4', 'A4', 'B4', 'C5', 'D5'], [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25], 0.8);
  const versePhrase = new Phrase();
  versePhrase.addChordProgression(verseChords);
  versePhrase.addMelody(verseMelody);
  versePhrase.addMelody(motif); // Add the motif to the verse
  score.addPhrase(versePhrase);

  // Create a chorus
  const chorusChords = createChordProgression([
    { root: 'F4', type: ChordType.Major, duration: 1, baseVolume: 0.7 },
    { root: 'G4', type: ChordType.Major, duration: 1, baseVolume: 0.7 },
    { root: 'C4', type: ChordType.Major, duration: 2, baseVolume: 0.7 }
  ], ChordPlayStyle.Solid, RhythmPattern.waltz());
  const chorusMelody = createMelody(['F5', 'E5', 'D5', 'C5', 'B4', 'C5'], [0.5, 0.5, 0.5, 0.5, 0.5, 0.5], 1);
  const chorusPhrase = new Phrase();
  chorusPhrase.addChordProgression(chorusChords);
  chorusPhrase.addMelody(chorusMelody);
  score.addPhrase(chorusPhrase);

  // Create a bridge with tempo change
  const bridgeTempo = new Tempo(160); // Even faster
  const bridgeChords = createChordProgression([
    { root: 'A4', type: ChordType.Minor, duration: 1, baseVolume: 0.6 },
    { root: 'D4', type: ChordType.Minor, duration: 1, baseVolume: 0.6 },
    { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.6 },
    { root: 'C4', type: ChordType.Major, duration: 1, baseVolume: 0.6 }
  ], ChordPlayStyle.Arpeggio, RhythmPattern.fourFourCommon());
  const bridgeMelody = keyboard.getScale('A4', ScaleType.NaturalMinor, Direction.Descending)
    .map(note => new NoteEvent(note.pitch, 250, 0.8, false));
  const bridgePhrase = new Phrase();
  bridgePhrase.addChordProgression(bridgeChords);
  bridgePhrase.addMelody(bridgeMelody);
  bridgePhrase.setTempo(bridgeTempo);
  score.addPhrase(bridgePhrase);

  // Repeat chorus and end
  score.addPhrase(chorusPhrase);
  score.addPhrase(introPhrase); // Use intro as outro

  // Play the entire score
  console.log("Playing complex melodic score:");
  await keyboard.playScore(score);
});


async function main() {
  // Run all tests
//   await testSuite.runAll();

  // Or run specific tests
  await testSuite.runTest("Jazz Chord Progression");
  await testSuite.runTest("Blues Chord Progression");
  await testSuite.runTest("Compose Short Score");
  await testSuite.runTest("Compose Complex Melodic Score");
}

main().catch(console.error);
